"""iPIXEL Color Bluetooth API client."""
from __future__ import annotations

import asyncio
import logging
from typing import Any

from bleak import BleakClient, BleakScanner
from bleak.exc import BleakError

from homeassistant.exceptions import HomeAssistantError

from .const import WRITE_UUID, NOTIFY_UUID, DEVICE_NAME_PREFIX, CONNECTION_TIMEOUT

_LOGGER = logging.getLogger(__name__)


class iPIXELError(HomeAssistantError):
    """Base iPIXEL error."""


class iPIXELConnectionError(iPIXELError):
    """iPIXEL connection error."""


class iPIXELTimeoutError(iPIXELError):
    """iPIXEL timeout error."""


class iPIXELAPI:
    """iPIXEL Color device API client."""

    def __init__(self, address: str) -> None:
        """Initialize the API client."""
        self._address = address
        self._client: BleakClient | None = None
        self._connected = False
        self._power_state = False
        
    async def connect(self) -> bool:
        """Connect to the iPIXEL device."""
        _LOGGER.debug("Connecting to iPIXEL device at %s", self._address)
        
        try:
            self._client = BleakClient(self._address)
            await asyncio.wait_for(
                self._client.connect(), timeout=CONNECTION_TIMEOUT
            )
            self._connected = True
            
            # Enable notifications
            await self._client.start_notify(NOTIFY_UUID, self._notification_handler)
            _LOGGER.info("Successfully connected to iPIXEL device")
            return True
            
        except asyncio.TimeoutError as err:
            _LOGGER.error("Connection timeout to %s: %s", self._address, err)
            raise iPIXELTimeoutError(f"Connection timeout: {err}") from err
        except BleakError as err:
            _LOGGER.error("Failed to connect to %s: %s", self._address, err)
            raise iPIXELConnectionError(f"Connection failed: {err}") from err

    async def disconnect(self) -> None:
        """Disconnect from the device."""
        if self._client and self._connected:
            try:
                await self._client.stop_notify(NOTIFY_UUID)
                await self._client.disconnect()
                _LOGGER.debug("Disconnected from iPIXEL device")
            except BleakError as err:
                _LOGGER.error("Error during disconnect: %s", err)
            finally:
                self._connected = False

    async def _send_command(self, command: bytes) -> bool:
        """Send command to the device."""
        if not self._connected or not self._client:
            raise iPIXELConnectionError("Device not connected")

        try:
            _LOGGER.debug("Sending command: %s", command.hex())
            await self._client.write_gatt_char(WRITE_UUID, command)
            return True
        except BleakError as err:
            _LOGGER.error("Failed to send command: %s", err)
            return False

    async def set_power(self, on: bool) -> bool:
        """Set device power state.
        
        Command format from protocol documentation:
        [5, 0, 7, 1, on_byte] where on_byte = 1 for on, 0 for off
        """
        on_byte = 1 if on else 0
        command = bytes([5, 0, 7, 1, on_byte])
        
        success = await self._send_command(command)
        if success:
            self._power_state = on
            _LOGGER.debug("Power set to %s", "ON" if on else "OFF")
        return success

    def _notification_handler(self, sender: Any, data: bytearray) -> None:
        """Handle notifications from the device."""
        _LOGGER.debug("Notification from %s: %s", sender, data.hex())
        # For this basic version, we just log notifications
        # Future versions will parse responses and update state

    @property
    def is_connected(self) -> bool:
        """Return True if connected to device."""
        return self._connected and self._client and self._client.is_connected

    @property
    def power_state(self) -> bool:
        """Return current power state."""
        return self._power_state

    @property
    def address(self) -> str:
        """Return device address."""
        return self._address


async def discover_ipixel_devices(timeout: int = 10) -> list[dict[str, Any]]:
    """Discover iPIXEL devices via Bluetooth scanning."""
    _LOGGER.debug("Starting iPIXEL device discovery")
    devices = []

    def detection_callback(device, advertisement_data):
        """Handle device detection."""
        if device.name and device.name.startswith(DEVICE_NAME_PREFIX):
            device_info = {
                "address": device.address,
                "name": device.name,
                "rssi": advertisement_data.rssi,
            }
            devices.append(device_info)
            _LOGGER.debug("Found iPIXEL device: %s", device_info)

    try:
        scanner = BleakScanner(detection_callback)
        await scanner.start()
        await asyncio.sleep(timeout)
        await scanner.stop()
        
        _LOGGER.debug("Discovery completed, found %d devices", len(devices))
        return devices
        
    except BleakError as err:
        _LOGGER.error("Discovery failed: %s", err)
        return []
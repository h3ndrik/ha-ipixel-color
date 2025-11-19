# Bluetooth Devices with HACS and Home Assistant - Complete Guide 2024

A comprehensive guide for using Bluetooth devices with Home Assistant through both built-in integrations and HACS custom components.

## Table of Contents

1. [Overview](#overview)
2. [Built-in Bluetooth Support](#built-in-bluetooth-support)
3. [HACS Bluetooth Integrations](#hacs-bluetooth-integrations)
4. [ESPHome Bluetooth Proxy](#esphome-bluetooth-proxy)
5. [Popular Bluetooth HACS Components](#popular-bluetooth-hacs-components)
6. [Device-Specific Integrations](#device-specific-integrations)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)
9. [Development Resources](#development-resources)

---

## Overview

### What is Bluetooth Support in Home Assistant?

Home Assistant provides comprehensive Bluetooth support through:

- **Built-in Bluetooth Integration**: Native support for BLE devices
- **HACS Custom Components**: Community-developed integrations for specific devices
- **Bluetooth Proxies**: Extended range using ESP32 devices
- **Platform-Specific Integrations**: Dedicated components for device families

### Bluetooth Types Supported

1. **Bluetooth Low Energy (BLE)**: Energy-efficient sensors and devices
2. **Classic Bluetooth**: Traditional devices like speakers and keyboards
3. **Bluetooth Mesh**: Networked device communication
4. **Beacon Technology**: iBeacons and Eddystone beacons for presence detection

---

## Built-in Bluetooth Support

### Prerequisites

#### Hardware Requirements
- **Bluetooth Adapter**: Built-in or USB Bluetooth adapter
- **Supported OS**: Linux (recommended), Windows, macOS
- **Architecture**: x86_64, ARM (Raspberry Pi), ARM64

#### Software Requirements
- Home Assistant 2024.1+ (latest recommended)
- BlueZ stack (Linux) or platform-specific drivers
- Proper device permissions

### Basic Setup

#### 1. Enable Bluetooth Integration

```yaml
# Navigate to: Settings → Devices & Services → Add Integration
# Search for "Bluetooth" and follow setup wizard

# OR add to configuration.yaml (legacy method)
bluetooth:
  adapters:
    - "hci0"  # Default adapter
```

#### 2. Docker Configuration

For Docker installations, you need to expose the Bluetooth device:

```yaml
# docker-compose.yml
version: '3'
services:
  homeassistant:
    container_name: homeassistant
    image: "ghcr.io/home-assistant/home-assistant:stable"
    volumes:
      - /path/to/config:/config
    devices:
      - /dev/ttyACM0:/dev/ttyACM0  # If using USB adapter
    network_mode: host
    privileged: true  # Required for Bluetooth access
    restart: unless-stopped
```

#### 3. Home Assistant OS Configuration

For Home Assistant OS, Bluetooth should work automatically if:
- Hardware supports Bluetooth
- Proper drivers are available
- No configuration needed in most cases

### Configuration Options

```yaml
# Advanced Bluetooth configuration
bluetooth:
  adapters:
    - "hci0"
  passive: false          # Enable active scanning
  restore_state: true     # Remember device states
  consider_home: 180      # Seconds before marking device away
```

---

## HACS Bluetooth Integrations

### Installation Prerequisites

1. **Install HACS**
   ```bash
   # Download HACS
   wget -O - https://get.hacs.xyz | bash -
   ```

2. **Enable HACS**
   - Settings → Devices & Services → Add Integration → HACS
   - Follow setup wizard and GitHub authentication

### Top Bluetooth HACS Integrations

#### 1. Passive BLE Monitor
**Purpose**: Advanced BLE sensor monitoring with extensive device support

**Installation:**
1. Open HACS → Integrations
2. Search "Passive BLE Monitor"
3. Download and restart Home Assistant
4. Add integration via Settings → Devices & Services

**Supported Devices:**
- Xiaomi MiBeacon sensors (temperature, humidity, plant sensors)
- Govee temperature/humidity sensors
- Ruuvitag environmental sensors
- Inkbird temperature sensors
- ATC custom firmware devices
- BlueMaestro sensors

**Configuration Example:**
```yaml
# configuration.yaml
ble_monitor:
  hci_interface: 0
  bt_interface: hci0
  active_scan: true
  discovery: true
  decimals: 1
  period: 60
  log_spikes: true
  use_median: false
  restore_state: true
  report_unknown: false
```

**Features:**
- Real-time sensor data
- Battery monitoring
- Signal strength (RSSI) tracking
- Automatic device discovery
- Historical data retention

#### 2. Bermuda BLE Trilateration
**Purpose**: Room-level presence detection using BLE signal strength

**Installation:**
```bash
# Via HACS
1. HACS → Integrations → Search "Bermuda"
2. Install and restart HA
3. Settings → Devices & Services → Add "Bermuda"
```

**Configuration:**
```yaml
# Automatic configuration via UI
# Requires multiple Bluetooth proxies for triangulation
```

**Features:**
- Area-based device tracking
- Distance estimation
- Multi-proxy triangulation
- Real-time location updates
- Integration with presence automation

#### 3. Generic Bluetooth Integration
**Purpose**: Send custom commands to any Bluetooth device

**Use Cases:**
- Custom BLE devices
- Arduino/ESP32 projects
- Proprietary Bluetooth protocols
- LED matrix displays (like iPIXEL)

**Example Configuration:**
```python
# Send custom BLE commands
service: bluetooth.send_command
data:
  device_id: "AA:BB:CC:DD:EE:FF"
  service_uuid: "0000fa02-0000-1000-8000-00805f9b34fb"
  characteristic_uuid: "0000fa03-0000-1000-8000-00805f9b34fb"
  data: [0x05, 0x00, 0x07, 0x01, 0x01]  # Power on command
```

---

## ESPHome Bluetooth Proxy

### Overview

ESPHome Bluetooth Proxy extends Home Assistant's Bluetooth range using ESP32 devices as remote Bluetooth scanners.

### Hardware Requirements
- **ESP32 Device** (ESP32-WROOM, ESP32-S3, etc.)
- **Power Supply** (USB or battery)
- **WiFi Connection** to Home Assistant network

### Setup Process

#### 1. Create ESPHome Device

```yaml
# bluetooth-proxy.yaml
esphome:
  name: bluetooth-proxy-01
  friendly_name: "Living Room BT Proxy"
  project:
    name: esphome.bluetooth-proxy
    version: "1.0"

esp32:
  board: esp32dev
  framework:
    type: esp-idf

# Enable logging
logger:
  level: INFO

# Enable Home Assistant API
api:
  encryption:
    key: "your_api_encryption_key"

ota:
  password: "your_ota_password"

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  
  # Enable fallback hotspot
  ap:
    ssid: "Bluetooth-Proxy Fallback Hotspot"
    password: "fallback_password"

# Bluetooth proxy configuration
esp32_ble_tracker:
  scan_parameters:
    interval: 1100ms      # How often to start a scan
    window: 1100ms        # How long each scan lasts
    active: true          # Active scanning (vs passive)

bluetooth_proxy:
  active: true

# Status LED (optional)
status_led:
  pin: GPIO2

# Web server (optional)
web_server:
  port: 80
```

#### 2. Flash to ESP32

```bash
# Install ESPHome
pip install esphome

# Compile and upload
esphome run bluetooth-proxy.yaml

# Or use ESPHome dashboard
esphome dashboard .
```

#### 3. Add to Home Assistant

1. **Auto-Discovery**: Device should appear in Settings → Devices & Services
2. **Manual Addition**: Use device IP address if auto-discovery fails
3. **Configure**: Set device area and friendly name

### Advanced Proxy Configuration

```yaml
# Multiple scan configurations
esp32_ble_tracker:
  scan_parameters:
    # High-frequency scanning for presence detection
    - interval: 320ms
      window: 300ms
      active: true
    # Low-power scanning for sensor data
    - interval: 5000ms
      window: 1000ms
      active: false

bluetooth_proxy:
  active: true
  
# Connection parameters
esp32_ble_client:
  - mac_address: "AA:BB:CC:DD:EE:FF"
    id: my_ble_client
    auto_connect: true
```

### Deployment Strategies

#### Single Room Coverage
```yaml
# Optimal placement for 30-50 foot radius
esp32_ble_tracker:
  scan_parameters:
    interval: 1100ms
    window: 1100ms
    active: true
```

#### Multi-Room Mesh
```yaml
# Coordinated scanning to avoid interference
esp32_ble_tracker:
  scan_parameters:
    interval: 2000ms    # Staggered intervals
    window: 500ms       # Shorter windows
    active: false       # Passive to reduce interference
```

---

## Popular Bluetooth HACS Components

### Device-Specific Integrations

#### 1. Xiaomi Devices
**Integration**: Passive BLE Monitor
**Supported Devices**:
- Mi Temperature and Humidity Monitor (LYWSDCGQ)
- Mi Flora Plant Sensor (HHCCJCY01)
- Mi Body Composition Scale 2 (XMTZC05HM)
- Mi Smart Antibacterial Humidifier (MJJSQ)

**Configuration:**
```yaml
ble_monitor:
  devices:
    - mac: "A4:C1:38:XX:XX:XX"
      name: "Living Room Sensor"
      encryption: true
      key: "your_device_key"
```

#### 2. Govee Sensors
**Integration**: Govee BLE Monitor
**Features**:
- Temperature and humidity monitoring
- Data logging and export
- Battery level tracking
- Multiple sensor support

#### 3. Ruuvitag Environmental Sensors
**Integration**: RuuviTag Sensor
**Capabilities**:
- Temperature, humidity, pressure
- Acceleration data
- Battery monitoring
- Outdoor weatherproofing

#### 4. SwitchBot Devices
**Integration**: SwitchBot BLE
**Supported Devices**:
- SwitchBot Bot (button pusher)
- SwitchBot Curtain (curtain controller)
- SwitchBot Meter (temp/humidity)
- SwitchBot Contact Sensor

### Audio and Entertainment

#### 1. Spotify Connect Devices
**Integration**: Spotcast
**Features**:
- Control Bluetooth speakers
- Transfer playback between devices
- Volume and track control

#### 2. Bluetooth Audio Control
**Integration**: Bluetooth Audio
**Capabilities**:
- A2DP audio streaming
- AVRCP media controls
- Device pairing management
- Multi-device switching

### Health and Fitness

#### 1. Fitness Trackers
**Integration**: Fitness Tracker BLE
**Supported Devices**:
- Xiaomi Mi Band series
- Amazfit devices
- Garmin fitness trackers (limited)

#### 2. Bluetooth Scales
**Integration**: Body Weight Scale
**Features**:
- Weight tracking
- BMI calculation
- Multiple user profiles
- Historical data

---

## Device-Specific Integrations

### Smart Home Devices

#### 1. Smart Locks
```yaml
# August Smart Lock integration
august:
  login_method: email
  username: your_email@example.com
  password: your_password
  
# Yale Smart Lock (via Bluetooth)
lock:
  - platform: yale_smart_living
    username: your_username
    password: your_password
```

#### 2. Thermostats
```yaml
# Honeywell T6 Pro via Bluetooth
climate:
  - platform: honeywell
    username: your_username
    password: your_password
```

#### 3. Smart Plugs and Switches
```yaml
# TP-Link Kasa devices with Bluetooth fallback
tplink:
  discovery: true
  
# Custom BLE switches
binary_sensor:
  - platform: bluetooth_le_tracker
    track_new_devices: true
```

### Sensors and Environmental

#### 1. Air Quality Monitors
```yaml
# Airthings Wave Plus via Bluetooth
sensor:
  - platform: airthings_ble
    mac: "AA:BB:CC:DD:EE:FF"
    monitored_conditions:
      - radon
      - co2
      - voc
      - humidity
      - temperature
      - pressure
```

#### 2. Soil Moisture Sensors
```yaml
# Mi Flora plant sensors
plant:
  tomato_plant:
    sensors:
      moisture: sensor.miflora_moisture
      battery: sensor.miflora_battery
      temperature: sensor.miflora_temperature
      conductivity: sensor.miflora_conductivity
      brightness: sensor.miflora_light_intensity
    min_moisture: 20
    max_moisture: 60
```

### Security and Monitoring

#### 1. Presence Detection
```yaml
# Bluetooth device tracking
device_tracker:
  - platform: bluetooth_tracker
    interval_seconds: 12
    consider_home: 180
    track_new_devices: true
    
# Room Assistant for room-level presence
mqtt:
  broker: room-assistant-broker
  discovery: true
```

#### 2. Pet Tracking
```yaml
# Pet tracker integration
binary_sensor:
  - platform: bluetooth_le_tracker
    device_id: "pet_collar_mac"
    name: "Pet Location"
```

---

## Troubleshooting

### Common Issues

#### 1. Bluetooth Adapter Not Detected
```bash
# Check Bluetooth status
sudo systemctl status bluetooth
sudo hciconfig -a

# Common solutions:
sudo systemctl enable bluetooth
sudo systemctl start bluetooth
sudo hciconfig hci0 up
```

#### 2. Permission Issues (Docker)
```bash
# Add user to bluetooth group
sudo usermod -a -G bluetooth $(whoami)

# Docker compose with proper permissions
devices:
  - /dev/bus/usb:/dev/bus/usb
network_mode: host
privileged: true
```

#### 3. Device Discovery Problems
```yaml
# Enable debug logging
logger:
  default: warning
  logs:
    homeassistant.components.bluetooth: debug
    homeassistant.components.bluetooth_le_tracker: debug
    custom_components.ble_monitor: debug
```

#### 4. Range and Connectivity Issues
- **Solution 1**: Deploy Bluetooth proxies strategically
- **Solution 2**: Reduce interference sources (WiFi, microwaves)
- **Solution 3**: Use active scanning for better discovery

### Debugging Tools

#### 1. Bluetooth Scanner
```bash
# Install bluetooth tools
sudo apt-get install bluez-tools

# Scan for devices
sudo hcitool lescan
sudo bluetoothctl scan on
```

#### 2. Log Analysis
```yaml
# Home Assistant logging configuration
logger:
  default: info
  logs:
    bluetooth_auto_recovery: debug
    bleak: debug
    bleak_retry_connector: debug
    habluetooth: debug
```

#### 3. Device Testing
```python
# Test BLE device connectivity
import asyncio
from bleak import BleakClient

async def test_device():
    address = "AA:BB:CC:DD:EE:FF"
    async with BleakClient(address) as client:
        services = await client.get_services()
        for service in services:
            print(f"Service: {service.uuid}")
            for char in service.characteristics:
                print(f"  Characteristic: {char.uuid}")

asyncio.run(test_device())
```

---

## Best Practices

### Performance Optimization

#### 1. Scanning Configuration
```yaml
# Optimized scanning for battery devices
esp32_ble_tracker:
  scan_parameters:
    interval: 5000ms    # Longer intervals save power
    window: 1000ms      # Shorter windows for efficiency
    active: false       # Passive scanning for battery life
```

#### 2. Device Grouping
```yaml
# Group related devices
group:
  bluetooth_sensors:
    name: "Bluetooth Sensors"
    entities:
      - sensor.living_room_temperature
      - sensor.bedroom_humidity
      - sensor.kitchen_air_quality
```

#### 3. Automation Efficiency
```yaml
# Efficient presence automation
automation:
  - alias: "Bluetooth Presence"
    trigger:
      - platform: state
        entity_id: device_tracker.my_phone
        to: 'home'
    condition:
      - condition: state
        entity_id: binary_sensor.bluetooth_proxy_connected
        state: 'on'
    action:
      - service: light.turn_on
        target:
          area_id: living_room
```

### Security Considerations

#### 1. Device Authentication
```yaml
# Use encrypted connections when available
ble_monitor:
  devices:
    - mac: "AA:BB:CC:DD:EE:FF"
      encryption: true
      key: "32-character-hex-key"
```

#### 2. Network Isolation
```yaml
# Isolate Bluetooth proxies on separate VLAN
wifi:
  ssid: "iot_network"
  password: "secure_password"
  manual_ip:
    static_ip: 192.168.100.10
    gateway: 192.168.100.1
    subnet: 255.255.255.0
```

#### 3. Regular Updates
```bash
# Keep ESPHome and integrations updated
pip install --upgrade esphome
# Update HACS integrations regularly through UI
```

### Reliability Improvements

#### 1. Redundancy
```yaml
# Multiple proxies for coverage
# Configure 2-3 proxies per area for redundancy
# Stagger scan timings to avoid interference
```

#### 2. Monitoring
```yaml
# Monitor proxy health
binary_sensor:
  - platform: ping
    host: 192.168.1.100  # Proxy IP
    name: "BT Proxy Living Room"
    scan_interval: 60
```

#### 3. Recovery Automation
```yaml
# Auto-restart failed proxies
automation:
  - alias: "Restart Bluetooth Proxy"
    trigger:
      - platform: state
        entity_id: binary_sensor.bt_proxy_living_room
        to: 'off'
        for: '00:05:00'
    action:
      - service: esphome.bluetooth_proxy_01_restart
```

---

## Development Resources

### Creating Custom Bluetooth Integrations

#### 1. Basic Integration Structure
```python
"""Custom Bluetooth device integration."""
import asyncio
import logging
from bleak import BleakClient, BleakScanner

from homeassistant.components import bluetooth
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

DOMAIN = "custom_bluetooth_device"

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry):
    """Set up custom Bluetooth device."""
    address = entry.data["address"]
    
    # Use Home Assistant's Bluetooth manager
    scanner = bluetooth.async_get_scanner(hass)
    
    # Create device client
    client = CustomBluetoothClient(hass, address)
    await client.connect()
    
    # Store in hass data
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = client
    
    return True

class CustomBluetoothClient:
    """Custom Bluetooth device client."""
    
    def __init__(self, hass, address):
        self.hass = hass
        self.address = address
        self._client = None
    
    async def connect(self):
        """Connect to device."""
        self._client = BleakClient(self.address)
        await self._client.connect()
    
    async def send_command(self, data):
        """Send command to device."""
        if self._client and self._client.is_connected:
            await self._client.write_gatt_char(
                "service-uuid", 
                bytearray(data)
            )
```

#### 2. Using HA Bluetooth Manager
```python
"""Integration using Home Assistant's Bluetooth manager."""
from homeassistant.components.bluetooth import (
    BluetoothScanningMode,
    async_discovered_service_info,
    async_last_service_info,
)

async def async_discovered_device(
    hass: HomeAssistant, 
    service_info: BluetoothServiceInfo
):
    """Handle discovered device."""
    if service_info.local_name == "My Device":
        # Create config entry or update existing
        pass
```

#### 3. ESPHome Integration
```yaml
# Custom ESPHome component for specific device
esphome:
  includes:
    - custom_ble_component.h

esp32_ble_client:
  - mac_address: "AA:BB:CC:DD:EE:FF"
    id: my_device

custom_ble_component:
  - ble_client_id: my_device
    id: my_custom_component

# Expose to Home Assistant
text_sensor:
  - platform: template
    name: "Device Status"
    id: device_status
    
sensor:
  - platform: template
    name: "Device Value"
    id: device_value
```

### Testing and Validation

#### 1. Device Simulation
```python
# Create mock Bluetooth device for testing
import asyncio
from bleak import BleakGATTCharacteristic, BleakGATTService
from bleak.server import BleakGATTServer

async def create_mock_device():
    """Create mock Bluetooth device."""
    
    def read_callback(characteristic):
        return b"mock_data"
    
    def write_callback(characteristic, data):
        print(f"Received: {data}")
    
    service = BleakGATTService("12345678-1234-1234-1234-123456789abc")
    char = BleakGATTCharacteristic(
        service,
        "12345678-1234-1234-1234-123456789abd",
        properties=["read", "write"],
        value=None
    )
    char.add_descriptor(read_callback)
    char.add_descriptor(write_callback)
    
    server = BleakGATTServer()
    server.add_service(service)
    await server.start()

# Run mock device
asyncio.run(create_mock_device())
```

#### 2. Integration Testing
```python
# Test custom integration
import pytest
from homeassistant.core import HomeAssistant
from custom_components.my_bluetooth_integration import async_setup_entry

async def test_setup_entry(hass: HomeAssistant):
    """Test integration setup."""
    config_entry = MockConfigEntry(
        domain="my_bluetooth_integration",
        data={"address": "AA:BB:CC:DD:EE:FF"}
    )
    
    assert await async_setup_entry(hass, config_entry)
    assert "my_bluetooth_integration" in hass.data
```

### Documentation and Resources

#### Official Documentation
- [Home Assistant Bluetooth](https://www.home-assistant.io/integrations/bluetooth/)
- [ESPHome Bluetooth Proxy](https://esphome.io/components/bluetooth_proxy.html)
- [HACS Documentation](https://hacs.xyz/docs/)

#### Community Resources
- [Home Assistant Community Forum](https://community.home-assistant.io/c/configuration/bluetooth/124)
- [ESPHome Discord](https://discord.gg/KhAMKrd)
- [Bluetooth Integration Examples](https://github.com/home-assistant/example-custom-config)

#### Development Tools
- [Bleak Python Library](https://github.com/hbldh/bleak) - Python Bluetooth LE interface
- [Blue Maestro SDK](https://github.com/BlueMaestro/ESP32-BLE-Lib) - ESP32 BLE development
- [Nordic nRF Connect](https://www.nordicsemi.com/Products/Development-tools/nrf-connect-for-mobile) - Mobile BLE debugging

---

## Conclusion

Bluetooth integration in Home Assistant through HACS provides extensive capabilities for connecting and controlling a wide variety of devices. From simple sensor monitoring to complex automation systems, the combination of built-in support and community-developed integrations offers solutions for almost any Bluetooth-enabled device.

### Key Takeaways

1. **Built-in Support**: Home Assistant's native Bluetooth integration covers most common use cases
2. **HACS Extensions**: Community integrations provide support for specific devices and advanced features
3. **Bluetooth Proxies**: ESPHome proxies extend range and improve reliability
4. **Custom Development**: Create integrations for unsupported devices using established patterns

### Next Steps

1. **Start Simple**: Begin with built-in integrations for supported devices
2. **Explore HACS**: Install community integrations for specific needs
3. **Deploy Proxies**: Set up Bluetooth proxies for better coverage
4. **Develop Custom**: Create custom integrations for unique devices
5. **Contribute Back**: Share successful integrations with the community

The Bluetooth ecosystem in Home Assistant continues to evolve rapidly, with new devices and integrations being added regularly. Stay connected with the community forums and HACS repositories to discover new capabilities and share your own innovations.
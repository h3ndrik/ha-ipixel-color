# iPIXEL Color - Home Assistant Integration

A basic Home Assistant custom integration for iPIXEL Color LED matrix displays via Bluetooth.

## Features

- **Auto-discovery**: Automatically finds iPIXEL devices via Bluetooth scanning
- **Power Control**: Turn your iPIXEL display on and off
- **Manual Configuration**: Add devices manually if auto-discovery fails
- **Device Registry**: Proper integration with Home Assistant device management

## Installation

### Manual Installation

1. Download or clone this repository
2. Copy the `custom_components/ipixel_color` directory to your Home Assistant `custom_components` directory
3. Restart Home Assistant
4. Go to Settings → Devices & Services → Add Integration
5. Search for "iPIXEL Color" and follow the setup wizard

### Directory Structure After Installation

```
config/
└── custom_components/
    └── ipixel_color/
        ├── __init__.py
        ├── api.py
        ├── config_flow.py
        ├── const.py
        ├── manifest.json
        ├── strings.json
        ├── switch.py
        └── translations/
            └── en.json
```

## Setup

### Automatic Discovery

1. Make sure your iPIXEL device is powered on and in pairing mode
2. Go to Settings → Devices & Services
3. Click "Add Integration"
4. Search for "iPIXEL Color"
5. Select your device from the discovered list

### Manual Setup

If automatic discovery fails:

1. Follow steps 1-4 above
2. Select "Manual entry" from the device list
3. Enter your device's Bluetooth address (format: AA:BB:CC:DD:EE:FF)
4. Give your device a friendly name

## Usage

Once configured, your iPIXEL device will appear as:

- **Switch Entity**: `switch.{device_name}_power`
  - Turn the display on/off
  - Shows connection status

### Automations

You can use the switch in automations:

```yaml
# Turn on iPIXEL when someone arrives home
automation:
  - alias: "iPIXEL Welcome Home"
    trigger:
      - platform: state
        entity_id: binary_sensor.front_door
        to: 'on'
    action:
      - service: switch.turn_on
        target:
          entity_id: switch.ipixel_display_power
```

## Troubleshooting

### Device Not Found

- Ensure your iPIXEL device is powered on
- Make sure the device is in pairing/discoverable mode
- Check that Bluetooth is enabled on your Home Assistant host
- Verify the device isn't already connected to another device

### Connection Issues

- Make sure the device is within Bluetooth range (typically 10-30 feet)
- Check Home Assistant logs for specific error messages
- Try removing and re-adding the integration
- Restart Home Assistant if Bluetooth seems unresponsive

### Logs

Enable debug logging to see detailed information:

```yaml
# Add to configuration.yaml
logger:
  logs:
    custom_components.ipixel_color: debug
```

## Current Limitations

This is a basic version with limited functionality:

- ✅ Power on/off control
- ✅ Connection management
- ❌ Brightness control (planned for v0.2.0)
- ❌ Color control (planned for v0.2.0)
- ❌ Image/GIF upload (planned for v0.3.0)
- ❌ Display modes (planned for v0.3.0)

## Technical Details

Based on reverse-engineered protocol documentation from:
- [go-ipxl](https://github.com/yyewolf/go-ipxl) - Go implementation
- [ipixel-ctrl](https://github.com/sdolphin-JP/ipixel-ctrl) - Python implementation

### Protocol Commands Used

- **Power On**: `[5, 0, 7, 1, 1]`
- **Power Off**: `[5, 0, 7, 1, 0]`
- **Bluetooth UUIDs**:
  - Write: `0000fa02-0000-1000-8000-00805f9b34fb`
  - Notify: `0000fa03-0000-1000-8000-00805f9b34fb`

## Development

### Requirements

- Home Assistant 2024.1+
- Python 3.11+
- `bleak>=0.20.0` for Bluetooth communication

### Testing

To test the integration:

1. Install in development mode
2. Enable debug logging
3. Test with a physical iPIXEL device
4. Check logs for any errors

## Contributing

This is the first version focusing on basic connectivity. Future contributions welcome for:

- Additional display features
- Better error handling
- Support for more iPIXEL device types
- UI improvements

## Version History

### v0.1.0 - Initial Release
- Basic Bluetooth connectivity
- Power on/off control
- Auto-discovery via Bluetooth scanning
- Manual device configuration
- Home Assistant device registry integration

## License

This project is provided under the MIT License. See LICENSE file for details.

## Acknowledgments

- Protocol documentation derived from community reverse engineering efforts
- Built using Home Assistant integration best practices
- Thanks to the iPIXEL community for protocol analysis
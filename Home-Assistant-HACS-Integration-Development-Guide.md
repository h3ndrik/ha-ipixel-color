# Home Assistant HACS Custom Integration Development Guide 2024

A comprehensive guide for developing and publishing custom integrations for Home Assistant through HACS (Home Assistant Community Store).

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Project Structure](#project-structure)
4. [Core Files](#core-files)
5. [Integration Development](#integration-development)
6. [Testing and Debugging](#testing-and-debugging)
7. [Publishing to HACS](#publishing-to-hacs)
8. [Best Practices](#best-practices)
9. [Common Issues](#common-issues)
10. [Resources](#resources)

---

## Overview

### What is HACS?

HACS (Home Assistant Community Store) v2.0 is the community-driven platform for sharing custom Home Assistant integrations, themes, and add-ons. Despite the name, it's completely free and open-source. HACS allows community developers to share custom code that addresses missing functionality in Home Assistant.

### Key Benefits

- **Easy Distribution**: Share your integration with the entire Home Assistant community
- **Automatic Updates**: Users get notified of new versions
- **Centralized Discovery**: Users can find and install integrations through a unified interface
- **Version Management**: Support for releases and version control

---

## Prerequisites

### Development Environment

1. **Home Assistant Development Setup**
   - Running Home Assistant instance (dev environment recommended)
   - Python 3.11+ development environment
   - Code editor (VS Code recommended with Home Assistant extension)

2. **Required Knowledge**
   - Python programming
   - Async/await patterns
   - Home Assistant architecture basics
   - Git/GitHub workflows

3. **Tools**
   - GitHub account
   - Git client
   - Python linting tools (black, flake8, mypy)

---

## Project Structure

### Repository Layout

```
your-integration/
├── README.md
├── hacs.json
├── custom_components/
│   └── your_domain/
│       ├── __init__.py
│       ├── manifest.json
│       ├── config_flow.py
│       ├── const.py
│       ├── sensor.py          # Platform files as needed
│       ├── switch.py
│       ├── light.py
│       └── strings.json
├── .github/
│   └── workflows/
│       └── validate.yml
└── tests/                     # Optional but recommended
    └── test_*.py
```

### Directory Requirements

- **Root level**: `README.md`, `hacs.json`
- **custom_components/**: Contains your integration code
- **Domain folder**: Named after your integration domain
- **Platform files**: One file per Home Assistant platform (sensor, switch, etc.)

---

## Core Files

### 1. hacs.json

Located in the repository root. Minimum required file for HACS recognition.

```json
{
  "name": "Your Integration Name",
  "zip_release": true,
  "hide_default_branch": false,
  "homeassistant": "2024.1.0",
  "hacs": "1.32.0",
  "filename": "your_integration.zip"
}
```

**Required Fields:**
- `name`: Display name in HACS

**Optional Fields:**
- `zip_release`: Use zip releases instead of git clone (recommended)
- `hide_default_branch`: Hide default branch in HACS UI
- `homeassistant`: Minimum Home Assistant version
- `hacs`: Minimum HACS version
- `filename`: Custom zip filename for releases
- `country`: ISO country codes for region-specific integrations

### 2. manifest.json

Located in `custom_components/your_domain/manifest.json`. Defines integration metadata.

```json
{
  "domain": "your_domain",
  "name": "Your Integration Name",
  "version": "1.0.0",
  "config_flow": true,
  "documentation": "https://github.com/yourusername/your-integration",
  "issue_tracker": "https://github.com/yourusername/your-integration/issues",
  "requirements": [
    "requests>=2.25.0",
    "aiohttp>=3.8.0"
  ],
  "dependencies": [],
  "after_dependencies": [],
  "codeowners": ["@yourusername"],
  "iot_class": "cloud_polling",
  "integration_type": "hub",
  "loggers": ["your_package"]
}
```

**Required Fields:**
- `domain`: Unique identifier for your integration
- `name`: Human-readable name
- `version`: SemVer or CalVer version string
- `config_flow`: Boolean indicating config flow support
- `documentation`: Documentation URL
- `codeowners`: GitHub usernames responsible for the code
- `iot_class`: How the integration communicates ([see IoT classes](https://developers.home-assistant.io/docs/creating_integration_manifest/#iot-class))
- `integration_type`: Type of integration (hub, device, service, helper)

**Optional Fields:**
- `requirements`: Python package dependencies
- `dependencies`: Home Assistant integration dependencies
- `after_dependencies`: Optional dependencies to load first
- `loggers`: Logger names used by the integration

### 3. const.py

Contains constants used throughout the integration.

```python
"""Constants for Your Integration."""

DOMAIN = "your_domain"
DEFAULT_NAME = "Your Integration"
DEFAULT_HOST = "192.168.1.100"
DEFAULT_PORT = 8080

# Configuration keys
CONF_HOST = "host"
CONF_PORT = "port"
CONF_API_KEY = "api_key"

# Attributes
ATTR_DEVICE_ID = "device_id"
ATTR_STATUS = "status"

# Services
SERVICE_UPDATE_STATUS = "update_status"
```

---

## Integration Development

### 1. __init__.py - Main Integration Setup

```python
"""The Your Integration integration."""
from __future__ import annotations

import logging
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ConfigEntryNotReady

from .const import DOMAIN
from .coordinator import YourIntegrationCoordinator

_LOGGER = logging.getLogger(__name__)

# Platforms to support
PLATFORMS: list[Platform] = [Platform.SENSOR, Platform.SWITCH]

type YourIntegrationConfigEntry = ConfigEntry[YourIntegrationCoordinator]

async def async_setup_entry(hass: HomeAssistant, entry: YourIntegrationConfigEntry) -> bool:
    """Set up Your Integration from a config entry."""
    
    # Create coordinator
    coordinator = YourIntegrationCoordinator(hass, entry)
    
    # Test connection
    await coordinator.async_config_entry_first_refresh()
    
    # Store coordinator in config entry
    entry.runtime_data = coordinator
    
    # Setup platforms
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    
    # Register services
    await _async_setup_services(hass)
    
    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    # Unload platforms
    if unload_ok := await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        # Clean up coordinator
        coordinator: YourIntegrationCoordinator = entry.runtime_data
        await coordinator.async_shutdown()
    
    return unload_ok

async def _async_setup_services(hass: HomeAssistant) -> None:
    """Set up services for the integration."""
    
    async def handle_update_status(call) -> None:
        """Handle the update status service call."""
        device_id = call.data.get("device_id")
        # Implement service logic here
        _LOGGER.info("Updating status for device: %s", device_id)
    
    hass.services.async_register(
        DOMAIN,
        "update_status",
        handle_update_status,
    )
```

### 2. config_flow.py - Configuration Flow

```python
"""Config flow for Your Integration."""
from __future__ import annotations

import logging
from typing import Any
import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResult
from homeassistant.exceptions import HomeAssistantError
from homeassistant.const import CONF_HOST, CONF_PORT

from .const import DOMAIN
from .api import YourIntegrationAPI, CannotConnect, InvalidAuth

_LOGGER = logging.getLogger(__name__)

STEP_USER_DATA_SCHEMA = vol.Schema({
    vol.Required(CONF_HOST): str,
    vol.Required(CONF_PORT, default=8080): int,
    vol.Required("api_key"): str,
})

async def validate_input(hass: HomeAssistant, data: dict[str, Any]) -> dict[str, Any]:
    """Validate the user input allows us to connect."""
    
    api = YourIntegrationAPI(data[CONF_HOST], data[CONF_PORT], data["api_key"])
    
    try:
        device_info = await api.async_get_device_info()
    except CannotConnect:
        raise CannotConnect
    except InvalidAuth:
        raise InvalidAuth
    except Exception:
        _LOGGER.exception("Unexpected exception")
        raise CannotConnect
    
    return {"title": f"Your Integration ({data[CONF_HOST]})", "unique_id": device_info["serial"]}

class YourIntegrationConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Your Integration."""
    
    VERSION = 1
    
    async def async_step_user(self, user_input: dict[str, Any] | None = None) -> FlowResult:
        """Handle the initial step."""
        if user_input is None:
            return self.async_show_form(
                step_id="user", data_schema=STEP_USER_DATA_SCHEMA
            )
        
        errors = {}
        
        try:
            info = await validate_input(self.hass, user_input)
        except CannotConnect:
            errors["base"] = "cannot_connect"
        except InvalidAuth:
            errors["base"] = "invalid_auth"
        except Exception:
            _LOGGER.exception("Unexpected exception")
            errors["base"] = "unknown"
        else:
            # Set unique ID to prevent duplicate entries
            await self.async_set_unique_id(info["unique_id"])
            self._abort_if_unique_id_configured()
            
            return self.async_create_entry(title=info["title"], data=user_input)
        
        return self.async_show_form(
            step_id="user", data_schema=STEP_USER_DATA_SCHEMA, errors=errors
        )

class CannotConnect(HomeAssistantError):
    """Error to indicate we cannot connect."""

class InvalidAuth(HomeAssistantError):
    """Error to indicate there is invalid auth."""
```

### 3. coordinator.py - Data Update Coordinator

```python
"""DataUpdateCoordinator for Your Integration."""
from __future__ import annotations

import asyncio
import logging
from datetime import timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import CONF_HOST, CONF_PORT
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.exceptions import ConfigEntryAuthFailed

from .api import YourIntegrationAPI, CannotConnect, InvalidAuth
from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

class YourIntegrationCoordinator(DataUpdateCoordinator):
    """Data update coordinator for Your Integration."""
    
    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize the coordinator."""
        self.entry = entry
        self.api = YourIntegrationAPI(
            host=entry.data[CONF_HOST],
            port=entry.data[CONF_PORT],
            api_key=entry.data["api_key"],
        )
        
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(seconds=30),
        )
    
    async def _async_update_data(self) -> dict:
        """Fetch data from API endpoint."""
        try:
            # Fetch data from your API
            data = await self.api.async_get_data()
            return data
        except InvalidAuth as err:
            raise ConfigEntryAuthFailed from err
        except CannotConnect as err:
            raise UpdateFailed(f"Error communicating with API: {err}") from err
    
    async def async_shutdown(self) -> None:
        """Shutdown the coordinator."""
        await self.api.async_close()
```

### 4. sensor.py - Platform Implementation

```python
"""Sensor platform for Your Integration."""
from __future__ import annotations

from homeassistant.components.sensor import (
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import UnitOfTemperature
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import YourIntegrationCoordinator

SENSOR_DESCRIPTIONS = [
    SensorEntityDescription(
        key="temperature",
        name="Temperature",
        native_unit_of_measurement=UnitOfTemperature.CELSIUS,
        state_class=SensorStateClass.MEASUREMENT,
    ),
    SensorEntityDescription(
        key="humidity",
        name="Humidity",
        native_unit_of_measurement="%",
        state_class=SensorStateClass.MEASUREMENT,
    ),
]

async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up sensor platform."""
    coordinator: YourIntegrationCoordinator = entry.runtime_data
    
    entities = []
    for description in SENSOR_DESCRIPTIONS:
        entities.append(YourIntegrationSensor(coordinator, description))
    
    async_add_entities(entities)

class YourIntegrationSensor(CoordinatorEntity[YourIntegrationCoordinator], SensorEntity):
    """Representation of a Your Integration sensor."""
    
    def __init__(
        self,
        coordinator: YourIntegrationCoordinator,
        description: SensorEntityDescription,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self.entity_description = description
        self._attr_unique_id = f"{coordinator.entry.unique_id}_{description.key}"
        self._attr_device_info = {
            "identifiers": {(DOMAIN, coordinator.entry.unique_id)},
            "name": "Your Device",
            "manufacturer": "Your Company",
            "model": "Your Model",
        }
    
    @property
    def native_value(self) -> str | None:
        """Return the native value of the sensor."""
        return self.coordinator.data.get(self.entity_description.key)
```

### 5. strings.json - Localization

```json
{
  "config": {
    "step": {
      "user": {
        "description": "Please enter your device connection details.",
        "data": {
          "host": "Host",
          "port": "Port",
          "api_key": "API Key"
        }
      }
    },
    "error": {
      "cannot_connect": "Failed to connect to the device",
      "invalid_auth": "Invalid authentication",
      "unknown": "Unexpected error occurred"
    }
  },
  "options": {
    "step": {
      "init": {
        "description": "Configure integration options.",
        "data": {
          "scan_interval": "Update interval (seconds)"
        }
      }
    }
  }
}
```

---

## Testing and Debugging

### Local Development

1. **Copy to Home Assistant**
   ```bash
   cp -r custom_components/your_domain /config/custom_components/
   ```

2. **Restart Home Assistant**
   - Navigate to Settings → System → Restart

3. **Add Integration**
   - Settings → Devices & Services → Add Integration
   - Search for your integration name

### Debugging

```python
import logging
_LOGGER = logging.getLogger(__name__)

# Add to configuration.yaml for detailed logs
logger:
  default: warning
  logs:
    custom_components.your_domain: debug
```

### Validation Tools

Use Home Assistant's validation tools:

```bash
# Install Home Assistant dev requirements
pip install homeassistant[dev]

# Run validation
python -m homeassistant.scripts.check_config --config /config
```

---

## Publishing to HACS

### 1. Prepare Repository

1. **Create GitHub Repository**
   - Public repository required
   - Add descriptive repository description
   - Include comprehensive README.md

2. **Add Required Files**
   - Ensure `hacs.json` is in repository root
   - Valid `manifest.json` in integration directory
   - Proper directory structure

3. **Create Release**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

### 2. Submit to HACS

1. **Brand Registration** (Required)
   - Submit to [home-assistant/brands](https://github.com/home-assistant/brands)
   - Include icon and metadata

2. **HACS Submission**
   - Visit [HACS Default Repository Submission](https://github.com/hacs/default/issues/new?template=integration.md)
   - Fill out the template completely
   - Wait for review and approval

### 3. Repository Requirements

**Must Have:**
- ✅ Public GitHub repository
- ✅ Repository description
- ✅ At least one release
- ✅ Valid `hacs.json` file
- ✅ Valid Home Assistant integration structure
- ✅ Registration in home-assistant/brands

**Should Have:**
- ✅ Comprehensive README
- ✅ License file
- ✅ Changelog
- ✅ Issue and PR templates
- ✅ GitHub Actions for validation

---

## Best Practices

### Code Quality

1. **Follow Home Assistant Guidelines**
   - Use async/await patterns
   - Implement proper error handling
   - Follow naming conventions

2. **Use Data Coordinators**
   - Centralize API calls
   - Handle rate limiting
   - Provide consistent data updates

3. **Type Hints**
   ```python
   from __future__ import annotations
   
   def function(param: str) -> bool:
       """Function with proper type hints."""
       return True
   ```

### Documentation

1. **README Structure**
   - Clear installation instructions
   - Configuration examples
   - Troubleshooting section
   - Feature list

2. **Code Documentation**
   - Docstrings for all functions
   - Clear variable names
   - Inline comments for complex logic

### Version Management

1. **Semantic Versioning**
   - MAJOR.MINOR.PATCH
   - Breaking changes increment MAJOR
   - New features increment MINOR
   - Bug fixes increment PATCH

2. **Changelog**
   - Keep a CHANGELOG.md
   - Document breaking changes
   - List new features and fixes

---

## Common Issues

### Integration Not Loading

1. **Check Logs**
   ```
   Settings → System → Logs
   ```

2. **Validate Manifest**
   - Ensure all required fields are present
   - Check JSON syntax
   - Verify dependencies exist

3. **Check Domain Conflicts**
   - Domain must be unique
   - No conflicts with core integrations

### HACS Submission Rejected

1. **Brand Not Registered**
   - Must register with home-assistant/brands first
   - Include proper icon and metadata

2. **Invalid Repository Structure**
   - Check directory structure
   - Ensure hacs.json exists
   - Verify manifest.json is valid

3. **Missing Requirements**
   - Repository must be public
   - Need at least one release
   - Repository description required

### Authentication Issues

```python
# Proper error handling for auth
try:
    await api.authenticate()
except InvalidAuth:
    raise ConfigEntryAuthFailed("Invalid credentials")
except Exception as err:
    raise UpdateFailed(f"Authentication failed: {err}")
```

---

## Resources

### Official Documentation

- [Home Assistant Developer Docs](https://developers.home-assistant.io/)
- [HACS Documentation](https://hacs.xyz/docs/)
- [Integration Manifest](https://developers.home-assistant.io/docs/creating_integration_manifest/)
- [Config Flow](https://developers.home-assistant.io/docs/config_entries_config_flow_handler/)

### Example Repositories

- [Home Assistant Example Custom Config](https://github.com/home-assistant/example-custom-config)
- [HACS Integration Template](https://github.com/hacs/integration-template)

### Development Tools

- [Home Assistant VS Code Extension](https://marketplace.visualstudio.com/items?itemName=keesschollaart.vscode-home-assistant)
- [HA CLI](https://github.com/home-assistant-ecosystem/home-assistant-cli)
- [Pre-commit Hooks](https://github.com/home-assistant/core/blob/dev/.pre-commit-config.yaml)

### Community Support

- [Home Assistant Community Forum](https://community.home-assistant.io/c/development/16)
- [Discord Developer Channel](https://discord.gg/home-assistant)
- [GitHub Discussions](https://github.com/home-assistant/core/discussions)

---

## Conclusion

Developing HACS integrations allows you to extend Home Assistant's functionality and share your solutions with the community. By following this guide and adhering to the established patterns, you can create robust, maintainable integrations that enhance the Home Assistant ecosystem.

Remember to:
- Start with a clear understanding of your integration's purpose
- Follow Home Assistant's architectural patterns
- Test thoroughly before publishing
- Maintain your integration after publication
- Engage with the community for support and feedback

The Home Assistant community is welcoming to new developers, so don't hesitate to ask questions and contribute to this amazing platform!
# External Modules

## Shared I2C bus

Robutek exposes a shared `I2C` bus for smart peripherals and external sensors.

| Signal | Pin |
| --- | --- |
| `SDA` | `IO10` |
| `SCL` | `IO3` |

Internal use:

- onboard color sensor
- support logic for battery management used by the reference firmware

The same bus is available to external modules.

## VL53L0X distance sensor

The optional distance sensor connects through `I2C`.

### What it provides

- optical distance measurement
- output in millimeters
- additional quality-related values in the supplied driver

### Integration notes

- place it so the optical window is not blocked
- keep line of sight clear
- avoid relying on a single reading when the target surface is dark or angled
- if multiple `I2C` devices are used, make sure addresses do not conflict

## External color sensor

The optional external RGB sensor also connects to the shared `I2C` bus.

The supplied driver distinguishes the built-in and external sensor by address:

- built-in sensor address: `0x43`
- external sensor address: `0x42`

Both sensors can coexist on the same bus if the correct address configuration is preserved.

### What it measures

- red
- green
- blue
- infrared
- clear light

Usability of the results depends on calibration and stable measurement geometry.

## Simple digital accessories

Simple accessories with signal, power, and ground are also supported:

- button modules
- servo mechanisms
- LED strips with a dedicated data line

These modules are not tied to Jaculus. Firmware requirements:

- digital input for buttons
- PWM for servo signal
- `WS2812B` timing for addressable LEDs
- `I2C` communication for smart sensors

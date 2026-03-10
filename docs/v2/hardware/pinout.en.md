# Pinout

## MCU pin usage

| Function | ESP32-S3 pin | Notes |
| --- | --- | --- |
| Status LED | `IO46` | Simple digital output |
| Onboard RGB LED chain | `IO48` | `WS2812B` data line |
| External RGB strip connector | `IO36` | Separate `WS2812B` data line |
| Left button | `IO2` | Digital input |
| Right button | `IO0` | Digital input |
| Servo output 1 | `IO21` | 50 Hz PWM-capable output |
| Servo output 2 | `IO38` | Often used for the pen lifter |
| Reflectance ADC 1 | `IO4` | Shared by `A1` or `B1` |
| Reflectance ADC 2 | `IO5` | Shared by `A2` or `B2` |
| Reflectance ADC 3 | `IO6` | Shared by `A3` or `B3` |
| Reflectance ADC 4 | `IO7` | Shared by `A4` or `B4` |
| Reflectance bank select | `IO8` | `1 = A bank`, `0 = B bank` |
| Reflectance IR emitter enable | `IO47` | `1 = emitters on` |
| Left motor driver A | `IO11` | PWM / H-bridge control |
| Left motor driver B | `IO12` | PWM / H-bridge control |
| Right motor driver A | `IO45` | PWM / H-bridge control |
| Right motor driver B | `IO13` | PWM / H-bridge control |
| Left encoder A | `IO40` | Digital input |
| Left encoder B | `IO39` | Digital input |
| Right encoder A | `IO41` | Digital input |
| Right encoder B | `IO42` | Digital input |
| Shared I2C SDA | `IO10` | Onboard and external smart sensors |
| Shared I2C SCL | `IO3` | Onboard and external smart sensors |

## Reflectance sensor mapping

The eight bottom sensors share four ADC inputs through multiplexing:

| ADC input | Front / line bank | Rear / wheel bank |
| --- | --- | --- |
| `IO4` | `A1` | `B1` |
| `IO5` | `A2` | `B2` |
| `IO6` | `A3` | `B3` |
| `IO7` | `A4` | `B4` |

Used names:

- front line sensors: `LineFL`, `LineFR`, `LineBL`, `LineBR`
- wheel sensors: `WheelFL`, `WheelFR`, `WheelBL`, `WheelBR`

## External connectors

### I2C connectors

The shared `I2C` bus is available on connectors marked `I2C`.

- `SDA = IO10`
- `SCL = IO3`
- the connector also provides power and ground

Use:

- optional `VL53L0X` distance sensor
- optional external RGB / color sensor

### External LED strip connector

Signals:

- data on `IO36`
- power from the board
- ground

The interface is intended for `WS2812B`-compatible LEDs.

### Servo connectors

The board provides two 3-pin servo connectors:

- `Servo1 = IO21`
- `Servo2 = IO38`

`Servo2` is commonly used for the pen lifter.

### Simple I/O connectors

Simple 3-pin connectors with signal, power, and ground are also available:

- `VCC`
- `GND`
- signal

Example: an external button can be connected to `IO1`, `VCC`, and `GND`.

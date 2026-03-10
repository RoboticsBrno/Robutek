# Outputs

## Motors

Robutek uses two DC motors in a differential layout.

Each motor is driven through a `DRV8834` H-bridge. Direction and power are controlled by a pair of MCU outputs.

| Motor | Control A | Control B |
| --- | --- | --- |
| Left | `IO11` | `IO12` |
| Right | `IO45` | `IO13` |

Typical firmware use: PWM for speed control.

Together with the encoders, they can be used to build a feedback loop, for example with a PID controller.

## Servo outputs

The board provides two 3-pin servo connectors:

| Connector | Signal pin | Typical use |
| --- | --- | --- |
| Servo1 | `IO21` | free / custom use |
| Servo2 | `IO38` | pen-lift servo |

Reference control parameters:

- frequency `50 Hz`
- pulse width approximately `0.5 ms` to `2.5 ms`

## Status LED

Status LED:

- `IO46`

Typical use:

- heartbeat indication
- battery or charging indication
- fault indication

## Onboard RGB LEDs

The robot chassis includes several `WS2812B` RGB LEDs used for backlighting, decoration, and status indication.

- data pin `IO48`

### Practical implications

- These LEDs require a timing-accurate `WS2812B` driver. Libraries such as `SmartLeds` or `FastLED` are recommended.

## External LED strip

An external `WS2812B` strip connects to a dedicated connector:

- data pin `IO36`

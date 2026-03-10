# Built-In Sensors

## Reflectance sensors

Robutek has `8` bottom-facing reflectance sensors for line following and surface detection.

### How they work

Each sensor shines infrared light onto the surface and measures the reflected intensity.

- lighter surface -> higher value
- darker surface -> lower value

The numeric range depends on the firmware and ADC configuration. A typical range with 10-bit reads is approximately `0..1023`.

### Electrical structure

The sensors are split into two banks of four:

- bank `A`: sensors in the front / line area
- bank `B`: sensors near the wheels

Only one bank is connected to the ADC at a time.

- select bank `A` by setting `IO8 = 1`
- select bank `B` by setting `IO8 = 0`

After switching banks, wait about `2 ms` for the measurement to settle.

### IR illumination control

The IR emitters are not permanently active.

- `IO47 = 1` turns the IR illumination on
- `IO47 = 0` turns the IR illumination off

If the readings are low or unstable, first check the emitter state.

### Practical reading procedure

1. Turn on the IR emitters.
2. Select the sensor bank.
3. Wait about `2 ms`.
4. Read the four ADC channels on `IO4..IO7`.
5. Use the values directly or convert them to calibrated quantities.

### Notes

- The result depends on the color and material of the surface.
- The result depends on the distance from the surface.
- Thresholds should be calibrated for the target environment.
- A short startup calibration is recommended for line following.

## Wheel encoders

Each motor has a quadrature encoder with two digital channels.

### Pin mapping

| Encoder | Channel A | Channel B |
| --- | --- | --- |
| Left | `IO40` | `IO39` |
| Right | `IO41` | `IO42` |

### What they provide

The encoders provide data for calculating:

- wheel direction
- wheel speed
- traveled distance
- robot heading change

Use: closed-loop speed control, odometry, more precise turns.

## User buttons

The board has two built-in buttons:

| Button | Pin |
| --- | --- |
| Left | `IO2` |
| Right | `IO0` |

Electrically, they are digital inputs.

## Onboard color sensor

Robutek includes one built-in RGB / color sensor connected to the shared `I2C` bus.

### Bus and addressing

- bus: shared `I2C`
- `SDA = IO10`
- `SCL = IO3`
- onboard sensor address bit: `high`
- address used by the driver: `0x43`

### Available channels

The color sensor can measure:

- red
- green
- blue
- infrared component
- clear / unfiltered light

### Output model

The driver provides:

- raw 16-bit values of individual channels, or
- calibrated normalized values in the range `0..1`

Calibration against white and black reference surfaces is recommended for real use.

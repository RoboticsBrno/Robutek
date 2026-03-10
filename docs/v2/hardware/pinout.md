# Pinout

## Využití pinů mikrokontroleru

| Funkce                          | Pin ESP32-S3 | Poznámka                           |
| ---                             | ---          | ---                                |
| Stavová LED                     | `IO46`       | Jednoduchý digitální výstup        |
| Vestavěný RGB LED řetězec       | `IO48`       | Datová linka `WS2812B`             |
| Konektor externího RGB pásku    | `IO36`       | Samostatná datová linka `WS2812B`  |
| Levé tlačítko                   | `IO2`        | Digitální vstup                    |
| Pravé tlačítko                  | `IO0`        | Digitální vstup                    |
| Servo výstup 1                  | `IO21`       | Výstup vhodný pro PWM 50 Hz        |
| Servo výstup 2                  | `IO38`       | Často používaný pro zvedání fixy   |
| ADC odrazového senzoru 1        | `IO4`        | Sdíleno pro `A1` nebo `B1`         |
| ADC odrazového senzoru 2        | `IO5`        | Sdíleno pro `A2` nebo `B2`         |
| ADC odrazového senzoru 3        | `IO6`        | Sdíleno pro `A3` nebo `B3`         |
| ADC odrazového senzoru 4        | `IO7`        | Sdíleno pro `A4` nebo `B4`         |
| Volba banky odrazových senzorů  | `IO8`        | `1 = banka A`, `0 = banka B`       |
| Povolení IR přisvětlení senzorů | `IO47`       | `1 = emitory zapnuté`              |
| Levý motor driver A             | `IO11`       | PWM / řízení H-můstku              |
| Levý motor driver B             | `IO12`       | PWM / řízení H-můstku              |
| Pravý motor driver A            | `IO45`       | PWM / řízení H-můstku              |
| Pravý motor driver B            | `IO13`       | PWM / řízení H-můstku              |
| Levý enkodér A                  | `IO40`       | Digitální vstup                    |
| Levý enkodér B                  | `IO39`       | Digitální vstup                    |
| Pravý enkodér A                 | `IO41`       | Digitální vstup                    |
| Pravý enkodér B                 | `IO42`       | Digitální vstup                    |
| Sdílené I2C SDA                 | `IO10`       | Vestavěné i externí chytré senzory |
| Sdílené I2C SCL                 | `IO3`        | Vestavěné i externí chytré senzory |

## Mapování odrazových senzorů

Osm spodních senzorů sdílí čtyři ADC vstupy přes multiplexing:

| ADC vstup | Přední / line banka | Zadní / wheel banka |
| ----- | ---- | ---- |
| `IO4` | `A1` | `B1` |
| `IO5` | `A2` | `B2` |
| `IO6` | `A3` | `B3` |
| `IO7` | `A4` | `B4` |

Používané názvy:

- přední line senzory: `LineFL`, `LineFR`, `LineBL`, `LineBR`
- wheel senzory: `WheelFL`, `WheelFR`, `WheelBL`, `WheelBR`

## Externí konektory

### I2C konektory

Sdílená `I2C` sběrnice je vyvedena na konektory označené `I2C`.

- `SDA = IO10`
- `SCL = IO3`
- konektor zároveň poskytuje napájení a zem

Použití:

- volitelný senzor vzdálenosti `VL53L0X`
- volitelný externí RGB / barevný senzor

### Konektor externího LED pásku

Signály:

- data na `IO36`
- napájení z desky
- zem

Rozhraní je určené pro LED kompatibilní s `WS2812B`.

### Servo konektory

Na desce jsou dva třípinové servo konektory:

- `Servo1 = IO21`
- `Servo2 = IO38`

`Servo2` se běžně používá pro zvedání fixy.

### Jednoduché I/O konektory

K dispozici jsou i jednoduché třípinové konektory se signálem, napájením a zemí:

- `VCC`
- `GND`
- signál

Příklad: externí tlačítko je připojeno na `IO1`, `VCC`, `GND`.

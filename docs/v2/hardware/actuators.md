# Výstupy

## Motory

Robůtek používá dva DC motory v diferenciálním uspořádání.

Každý motor je řízen přes H-můstek DRV8834. Směr a výkon jsou určeny dvojicí výstupů mikrokontroleru.

| Motor | Řízení A | Řízení B |
| ----- | -------- | -------- |
| Levý  |  `IO11`  |  `IO12`  |
| Pravý |  `IO45`  |  `IO13`  |

Obvyklé použití ve firmwaru: PWM pro regulaci rychlosti.

V kombinaci s enkodéry je možné vytvořit zpětnovazebnous smyčku např. pomocí PID regulátoru.

## Servo výstupy

Deska obsahuje dva třípinové servo konektory:

| Konektor | Signálový pin |     Typické použití     |
| -------- | ------------- | ----------------------- |
|  Servo1  |    `IO21`     | volné / vlastní použití |
|  Servo2  |    `IO38`     | servo pro zvedání fixy  |

Referenční parametry řízení:

- frekvence `50 Hz`
- šířka pulzu přibližně `0.5 ms` až `2.5 ms`

## Stavová LED

Stavová LED:

- `IO46`

Typické použití:

- heartbeat signalizace
- indikace baterie nebo nabíjení
- indikace chybového stavu

## Vestavěné RGB LED

Podvozek robůtka obsahuje několik RGB LED WS2812B používaných na podsvícení, okrasu a indikaci stavu.

- datový pin `IO48`

### Praktické důsledky

- Tyto LED potřebují časově přesný ovladač pro `WS2812B`. Doporučujeme knihovny SmartLeds, nebo FastLED.

## Externí LED pásek

Externí `WS2812B` pásek se připojuje na samostatný konektor:

- datový pin `IO36`

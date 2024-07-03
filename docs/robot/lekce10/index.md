# Lekce 10 - servo

Na ELKS jsou k dispozici dva jednoduché servo porty na levé straně ELSKu.

- `SER0` - pin 35
- `SER1` - pin 40

## Začátek

Abychom mohli používat servo musíme ho získat příkazem `#!ts const servo = new Servo(...)`, a do závorky napíšeme číslo PINu, timer (nastavte ho na 1) a kanál (nastavte ho na 3)

```ts
import { Servo } from "./libs/servo.js"

const SERVO_PIN = 35;
const servo = new Servo(SERVO_PIN, 1, 3);
```

Na nastavení pozice serva použijte funkci `#!ts servo.write()` a do závorek zadejte číslo od 0 do 1023.
```ts
servo.write(0);    // 0°
servo.write(512);  // 90°
servo.write(1023); // 180°
```

## Dvě serva

Pokud chceme používat dvě serva, musíme změnít kanál v konfiguraci druhého serva.

```ts
import { Servo } from "./libs/servo.js"

const SERVO_PIN_0 = 35;
const SERVO_PIN_1 = 40;
const servo_0 = new Servo(SERVO_PIN_0, 1, 3);
const servo_1 = new Servo(SERVO_PIN_1, 1, 4);
```

## Zadání A

Vytvořte program který bude číst data z joysticku a zapisovat je do dvou serv.

??? note "Řešení"
    ```ts
    import * as adc from "adc";
    import { Servo } from "./libs/servo.js"

    const SERVO_PIN_0 = 35;
    const SERVO_PIN_1 = 40;
    const POT_PIN_X = 9;
    const POT_PIN_Y = 10;

    adc.configure(POT_PIN_X);
    adc.configure(POT_PIN_Y);

    const servo_0 = new Servo(SERVO_PIN_0, 1, 3);
    const servo_1 = new Servo(SERVO_PIN_1, 1, 4);

    setInterval(() => {
        servo_0.write(adc.read(POT_PIN_X));
        servo_0.write(adc.read(POT_PIN_Y));
    }, 25);
    ```
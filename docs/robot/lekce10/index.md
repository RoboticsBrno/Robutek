# Bonus - Servo

Na Robůtkovi jsou dvě pozice na připojení serva - piny 38 a 21.

## Začátek

Abychom mohli používat servo musíme ho získat příkazem `#!ts const servo = new Servo(...)`, a do závorky napíšeme číslo PINu, timer (nastavte ho na 1) a kanál (nastavte ho na 3)

```ts
import { Servo } from "./libs/servo.js"

const SERVO_PIN = 38;
const servo = new Servo(SERVO_PIN, 1, 3);
```

Na nastavení pozice serva použijte funkci `#!ts servo.write()` a do závorek zadejte číslo od 0 do 1023.
```ts
servo.write(0);    // 0°
servo.write(512);  // 90°
servo.write(1023); // 180°
```

## Kreslení tužkou

Na servo se dá připojit tužka. Abychom mohli tužku ovládat musíme ji získat příkazem `#!ts const pen = new Pen(<číslo pinu>)`. Robůtek má 4 předdefinované konstaty pro ovládání `UP`, `DOWN`, `MIDDLE` a `UNLOAD`.

```ts
import { Pen } from "./libs/robot.js"

const SERVO_PIN = 38;

const pen = new Pen(SERVO_PIN);
```

Na nastavení pozice tužky použijeme funkci `#!ts pen.move()` a do závorek zadejte číslo on 0 od 1023 nebo jednu z konstant `Pen.UP`, `Pen.DOWN`, `Pen.MIDDLE` a `Pen.UNLOAD`.

```ts
pen.move(Pen.DOWN);     // Začne kreslit
pen.move(Pen.UP);       // Přestane kreslit
pen.move(Pen.UNLOAD);   // Vytáhne tužku
```

## Zadání A

Vytvořte program, který při zmáčknutí tlačítka zasune pero a druhé tlačítko, které ho vysune.

??? note "Řešení"
    ```ts
    import { Pen } from "./libs/robot.js"
    import * as gpio from "gpio"

    const SERVO_PIN = 38;
    const LBTN_PIN = 2;
    const RBTN_PIN = 0;

    gpio.pinMode(LBTN_PIN, gpio.PinMode.INPUT);
    gpio.pinMode(RBTN_PIN, gpio.PinMode.INPUT);

    const pen = new Pen(SERVO_PIN);

    gpio.on("falling", LBTN_PIN, () => {
        pen.move(Pen.DOWN);
    });

    gpio.on("falling", RBTN_PIN, () => {
        pen.move(Pen.UP);
    });
    ```
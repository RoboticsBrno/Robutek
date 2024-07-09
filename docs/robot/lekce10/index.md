# Bonus - Servo (Kreslení tužkou)

Na Robůtkovi jsou dvě pozice na připojení serva - piny 38 a 21.

## Začátek

Abychom mohli používat servo musíme ho získat příkazem `#!ts const servo = new Servo(...)`, a do závorky napíšeme číslo PINu, timer (nastavte ho na 1) a kanál (nastavte ho na 4)

```ts
import { Pins } from "./libs/robutek.js"
import { Servo } from "./libs/servo.js"

const servo = new Servo(Pins.Servo2, 1, 4); // Pins.Servo2 je pin 38
```

Na nastavení pozice serva použijte funkci `#!ts servo.write()` a do závorek zadejte číslo od 0 do 1023.
```ts
servo.write(0);    // 0°
servo.write(512);  // 90°
servo.write(1023); // 180°
```

## Kreslení tužkou

Na servo se dá připojit tužka. Tužka se ovládá stejným způsobem jenom Robůtek má 3 předdefinované konstaty pro ovládání `Up`, `Down` a `Unload`.

```ts
import { Pins } from "./libs/robutek.js"
import { Servo } from "./libs/servo.js"

const pen = new Servo(Pins.Servo2, 1, 4); // Pins.Servo2 je pin 38
```

Na nastavení pozice tužky použijeme funkci `#!ts pen.write()` a do závorek zadejte číslo on 0 od 1023 nebo jednu z konstant `robutek.PenPos.Up`, `robutek.PenPos.Down` a `robutek.PenPos.Unload`.

```ts
pen.write(robutek.PenPos.Down);     // Začne kreslit
pen.write(robutek.PenPos.Up);       // Přestane kreslit
pen.write(robutek.PenPos.Unload);   // Vytáhne tužku
```

## Zadání A

Vytvořte program, který při zmáčknutí tlačítka zasune pero a druhé tlačítko, které ho vysune.

??? note "Řešení"
    ```ts
    import { Pins } from "./libs/robutek.js"
    import * as robutek from "./libs/robutek.js"
    import { Servo } from "./libs/servo.js"
    import * as gpio from "gpio"

    const LBTN_PIN = 2;
    const RBTN_PIN = 0;

    gpio.pinMode(LBTN_PIN, gpio.PinMode.INPUT);
    gpio.pinMode(RBTN_PIN, gpio.PinMode.INPUT);

    const pen = new Servo(Pins.Servo2, 1, 4);

    gpio.on("falling", LBTN_PIN, () => {
        pen.write(robutek.PenPos.Down);
    });

    gpio.on("falling", RBTN_PIN, () => {
        pen.werite(robutek.PenPos.Up);
    });
    ```

# Lekce 6 - Servo (Kreslení tužkou)

Na Robůtkovi jsou dvě pozice na připojení serva - piny 38 a 21.

## Začátek

Abychom mohli používat servo musíme ho získat příkazem `#!ts const servo = new Servo(...)`, a do závorky napíšeme číslo PINu, timer (nastavte ho na 1) a kanál (nastavte ho na 4)

```ts
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
import { Servo } from "./libs/servo.js"
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V2");

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
    import { Servo } from "./libs/servo.js"
    import * as gpio from "gpio"
    import { createRobutek } from "./libs/robutek.js"
    const robutek = createRobutek("V2");

    const LBTN_PIN = 2;
    const RBTN_PIN = 0;

    gpio.pinMode(LBTN_PIN, gpio.PinMode.INPUT);
    gpio.pinMode(RBTN_PIN, gpio.PinMode.INPUT);

    const pen = new Servo(robutek.Pins.Servo2, 1, 4);

    gpio.on("falling", LBTN_PIN, () => {
        pen.write(robutek.PenPos.Down);
    });

    gpio.on("falling", RBTN_PIN, () => {
        pen.write(robutek.PenPos.Up);
    });
    ```

## Zadání B

Zkombinuj poznatky z lekce 5 s motory s touto, a vytvoř program který nakreslí fixou na papír čtverec po stistku tlačítka.

??? note "Řešení"
    ```ts
    import { Servo } from "./libs/servo.js"
    import * as gpio from "gpio"
    import { createRobutek } from "./libs/robutek.js"
    const robutek = createRobutek("V2");

    const LBTN_PIN = 2;
    const RBTN_PIN = 0;

    gpio.pinMode(LBTN_PIN, gpio.PinMode.INPUT);
    gpio.pinMode(RBTN_PIN, gpio.PinMode.INPUT);

    const pen = new Servo(robutek.Pins.Servo2, 1, 4);

    gpio.on("falling", LBTN_PIN, async () => {
        pen.write(robutek.PenPos.Down); // fixa dolů

        robutek.setSpeed(100) // Nastav rychlost na 100

        await robutek.move(0, { distance: 300 }) // Ujeď 30 cm
        await robutek.rotate(90)
        await robutek.move(0, { distance: 300 })
        await robutek.rotate(90)
        await robutek.move(0, { distance: 300 })
        await robutek.rotate(90)
        await robutek.move(0, { distance: 300 })
        await robutek.rotate(90)

        pen.write(robutek.PenPos.Up); // fixa nahoru
    });
    ```

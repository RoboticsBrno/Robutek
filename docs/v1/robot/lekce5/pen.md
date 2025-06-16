# Lekce 5 - Servo (Kreslení tužkou)

Na Robůtkovi jsou dvě pozice na připojení serva - piny 38 a 21. Pokud jste si podle návodu ke složení robota připevnili servo a tužku, jste připraveni na to kreslit.

## Začátek

Abychom mohli používat servo, musíme ho získat příkazem `#!ts const servo = new Servo(...)`, kde do závorky napíšeme číslo PINu, timer (zde ho nastavíme na 1) a kanál (zde ho nastavíme na 4)

```ts
import { Pins } from "./libs/robutek.js"
import { Servo } from "./libs/servo.js"

const servo = new Servo(Pins.Servo2, 1, 4); // Pins.Servo2 je pin 38
```

Na nastavení pozice serva použijeme funkci `#!ts servo.write()` a do závorek zadáme číslo od 0 do 1023,
které určí úhel otočení.
```ts
servo.write(0);    // 0°
servo.write(512);  // 90°
servo.write(1023); // 180°
```

## Kreslení tužkou

Tím, že zvedáme nebo pokládáme servo, můžeme ovládat připevněnou tužku. 
Abychom si nemuseli pamatovat konkrétní hodnoty pro zvedání tužky, Robůtek má 3 předdefinované konstaty pro ovládání: `Up`, `Down` a `Unload`.
Pokud bychom do něj dávali různé druhy tužek, můžeme si samozřejmě nadefinovat vlastní.

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
        pen.write(robutek.PenPos.Up);
    });
    ```

## Zadání B

Zkombinuj poznatky z lekce 5 s motory s touto, a vytvoř program který nakreslí fixou na papír čtverec po stistku tlačítka.

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

# Lekce 2 - RGB LED + tlačítko + události

V této lekci si napíšeme své první programy.

Ukážeme si ovládání RGB LED umístěné na ESP32 a práci s událostmi řízenými tlačítkem nebo časem.

TypeScript (JavaScript) je imperativní programovací jazyk. To znamená, že se vykoná vše, co do programu napíšeme,
v pořadí, v jakém jsme to napsali.

!!! note "Poznámka"
    V lekci 1. jsme se naučili jak vytvořit nový projekt z odkazu. Teď si tuto znalost ověříme.

Vytvořte si nový projekt z nového odkazu:

=== "Odkaz"
    ```
    https://robutek.robotikabrno.cz/v2/robot/blank_project.tar.gz
    ```
=== "Zip"
    [Stáhnout ZIP](../blank_project.zip){ .md-button .md-button--primary }

## Zadání A

Nejdříve si zopakujeme předchozí lekci a rozsvítíme RGB LED na Robůtkovi (`robutek.Pins.ILED`) jednou barvou (například červenou).

Na začátku tohoto úkolu si otevřeme nový prázdný projekt. V souboru `index.ts` jsou připraveny `import` příkazy: ty nám umožní využívat funkcionalitu z různých souborů, např. jednoduše ovládat LEDku, nebo využívat nadefinované barvy.

Pásek inicializujeme pomocí `const ledStrip = new SmartLed(robutek.Pins.ILED, 1, LED_WS2812B)`.
Barvu LED nastavíme pomocí `ledStrip.set(0, colors.<nějaká_barva>)` a zobrazíme pomocí `ledStrip.show()`.

??? note "Řešení"

    ```ts
    import * as colors from "./libs/colors.js";
    import { LED_WS2812B, SmartLed } from "smartled";
    import { createRobutek } from "./libs/robutek.js";
    const robutek = createRobutek("V2");

    const ledStrip = new SmartLed(robutek.Pins.ILED, 1, LED_WS2812B); // robutek.Pins.ILED je pin 48

    ledStrip.set(0, colors.red); // nastaví barvu první LED na červenou (RGB 255 0 0)
    ledStrip.show(); // zobrazí nastavení na LED
    ```

## Co je to událost v programování?

Událost je situace, kterou program rozpozná (například stisknutí nebo puštění tlačítka, uplynutí určitého času).
Po zaznamenání události se vykoná kód, který je k této události přiřazen.

S událostí řízenou časem už jsme se setkali: pomocí `setInterval` umíme každých `X` milisekund spouštět daný kód. Zatim ale nevíme, jak `setInterval` ukončit, tedy jak přestat kód opakovaně spouštět. K tomu slouží funkce `clearInterval(INTERVAL_ID)`. `INTERVAL_ID` nám při vytáření intervalu vrátí funkce `setInterval()`.

```ts
import { createRobutek } from "./libs/robutek";
const intervalId = setInterval(()=>{
    console.log("interval");
}, 1000);

await sleep(10000);

clearInterval(intervalId);
```



Události řízené stiskem tlačítka můžeme ovládat pomocí přiložené knihovny `gpio`.
`GPIO` je jednoduchá elektronická konstrukce, která nám umožňuje posílat nebo přijímat bitové informace, a na základě toho měnit chování našeho programu.

Abychom mohli přijímat signál ze stisknutí tlačítka, nejdříve musíme nastavit vybraný pin jako vstupní. To uděláme příkazem `#!ts gpio.pinMode(PIN, gpio.PinMode.INPUT)`, kde `PIN` je číslo pinu (najdeme pod `robutek.Pins.`), a druhý argument je režim. Pokud bychom chtěli např. použít LEDky přímo na desce, chceme dané piny použít jako výstupní, tedy `gpio.PinMode.OUTPUT`.

Jakmile máme nastavené vstupní tlačítko, můžeme na něm pozorovat události pomocí `#!ts gpio.on()`. Reakci na stisknutí tlačítka vyvoláme argumentem `"falling"`, reakci na puštění `"rising"`. Kód, který při stisku tlačítka něco vykoná, tedy může vypadat takto:

```ts
gpio.pinMode(robutek.Pins.ButtonRight, gpio.PinMode.INPUT);

gpio.on("falling", robutek.Pins.ButtonRight, () => {
  // něco udělej
});
```

## Zadání B

Pomocí událostí rozsvítíme při stisknutí tlačítka (`robutek.Pins.ButtonRight`) RGB LED na ESP32 (`robutek.Pins.ILED`) a při puštění ho opět zhasneme.

??? note "Řešení"

    ```ts
    import { createRobutek } from "./libs/robutek.js"
    import * as colors from "./libs/colors.js";
    import { LED_WS2812B, SmartLed } from "smartled";
    import * as gpio from "gpio";

    const robutek = createRobutek("V2");

    const ledStrip = new SmartLed(robutek.Pins.ILED, 1, LED_WS2812B);

    gpio.pinMode(robutek.Pins.ButtonRight, gpio.PinMode.INPUT); // nastaví pin 0 jako vstup

    gpio.on("falling", robutek.Pins.ButtonRight, () => { // událost, která proběhne při stisknutí tlačítka připojeného na pin 0
        ledStrip.set(0, colors.red); // nastaví barvu první LED na červenou (RGB 255 0 0)
        ledStrip.show(); // zobrazí nastavení na LED
    });

    gpio.on("rising", robutek.Pins.ButtonRight, () => { // událost, která proběhne při puštění tlačítka připojeného na pin 0
        ledStrip.set(0, colors.off); // nastaví první LED na zhasnutou (RGB 0 0 0)
        ledStrip.show(); // zobrazí nastavení na LED
    });
    ```

## Zadání C

Dvakrát za sekundu vypíšeme stav zmáčknutí tlačítka (0 nebo 1). Stav daného tlačítka získáme pomocí `#!ts gpio.read(číslo pinu)`.

Vzpomeňme si z prvního programu, že opakování dosáhneme pomocí `setInterval()`, a informaci vypíšeme pomocí `#!ts console.log()`.

??? note "Řešení"

    ```ts
    import * as gpio from "gpio";
    import { createRobutek } from "./libs/robutek.js";
    const robutek = createRobutek("V2");

    gpio.pinMode(robutek.Pins.ButtonRight, gpio.PinMode.INPUT); // nastaví pin 0 jako vstup

    setInterval(() => { // pravidelně vyvolává událost
        console.log(gpio.read(robutek.Pins.ButtonRight)); // načte a vypíše stav tlačítka připojeného na pin 0
    }, 500); // čas opakování se udává v milisekundách (500 ms je 0,5 sekundy)
    ```

## Výstupní úkol V1 - Pozdrav

Při stisknutí tlačítka (`robutek.Pins.ButtonRight`) vypíšeme pozdrav.

## Výstupní úkol V2 - Změna barvy

Při stisknutí tlačítka (`robutek.Pins.ButtonRight`) rozsvítíme RGB LED na Robůtkovi (`robutek.Pins.ILED`) jednou barvou a při puštění barvu změníme na jinou.


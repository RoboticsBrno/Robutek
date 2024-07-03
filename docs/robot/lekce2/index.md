# Lekce 2 - RGB LED + tlačítko + události

V této lekci si napíšeme své první programy. 

Ukážeme si ovládání RGB LED umístěné na ESP32 a práci s událostmi řízenými tlačítkem nebo časem.

TypeScript (JavaScript) je imperativní programovací jazyk. Znamená to, že se vykoná vše co do programu napíšeme,
v takovém pořadí jak jsme to zapsali. Programy mají řadu věcí co v nich umíme zapsat, nám zatím budou stačit
nejzákladnější příkazy: i velice jednoduchý program už může mít viditelný výsledek.

[Stáhnout ZIP s prázdným projektem](./blank_project.zip){ .md-button .md-button--primary }

## Zadání A

Nejdříve si zopakujeme předchozí lekci, a rozsvítíme RGB LED na ESP32 (`GPIO 48`) jednou barvou (například červenou).

Na začátku tohoto úkolu si stáhneme nový [zip](./blank_project.zip) soubor obsahující prázdný projekt. Po stažení složku rozbalíme a otevřeme ve Visual Studio Code. V souboru `index.ts` jsou připraveny `import` příkazy: ty nám umožní využívat funkcionalitu z různých souborů, např. jednoduše ovládat LEDku, nebo využívat nadefinované barvy.

Abychom mohli LED u procesoru ovládat, musíme ji získat příkazem `#!ts const led = new SmartLed(...)`, a do závorky napíšeme číslo PINu, počet LED světel (zatím je to 1), a typ světla: `LED_WS2812`. Barvu LED nastavíme pomocí `led.set(0, colors.nějaká_barva)` a zobrazíme pomocí `led.show()`.

??? note "Řešení"
    ```ts
    import { SmartLed, LED_WS2812 } from "smartled";
    import * as colors from "./libs/colors.js"

    const LED_PIN = 48;
    const LED_COUNT = 1;

    const ledStrip = new SmartLed(LED_PIN, LED_COUNT, LED_WS2812);  // připojí pásek na pin 48, s 1 ledkou a typem WS2812

    ledStrip.set(0, colors.red); // nastaví barvu nulté LED na červenou (RGB 255 0 0)
    ledStrip.show(); // zobrazí nastavení na LED
    ```

## Co je to událost v programování?

Událost, která je programem rozpoznávána (například stisknutí nebo puštění tlačítka nebo uplynutí nějakého času).
Po zaznamenání události se vykoná kód, který je k ní přiřazen.

S událostí řízenou časem už jsme se setkali: pomocí `setInterval` umíme vyvolat něco, co se opakuje každých `X` milisekund.

Události řízené stiskem tlačítka můžeme ovládat pomocí přiložené knihovny `gpio`.
`GPIO` je jednoduchá elektronická konstrukce, která nám umožňuje posílat nebo přijímat bit informace, a na základě toho měnit chování našeho programu.

Abychom mohli přijímat signál ze stisknutí tlačítka, nejdříve musíme nastavit vybraný pin jako vstupní. To uděláme příkazem `#!ts gpio.pinMode(PIN, gpio.PinMode.INPUT)`, kde PIN je číslo pinu (najdeme na stránce), a druhý argument je režim. Pokud bychom chtěli např. použít LEDky přímo na desce, chceme dané piny použít jako výstupní, tedy `gpio.PinMode.OUTPUT`.

Jakmile máme nastavené vstupní tlačítko, můžeme na něm pozorovat události pomocí `#!ts gpio.on()`. Reakci na stisknutí tlačítka vyvoláme argumentem `"falling"`, reakci na puštění `"rising"`. Kód, který při stisku tlačítka něco vykoná, tedy může vypadat takto:

```ts
const BTN_PIN = nějaké číslo;
gpio.pinMode(BTN_PIN, gpio.PinMode.INPUT); 

gpio.on("falling", BTN_PIN, () => {
    // něco udělej
});
```

## Zadání B

Pomocí událostí rozsvítíme při stisknutí tlačítka (GPIO 0) RGB LED na ESP32 (`GPIO 48`) a při puštění ho opět zhasneme.

??? note "Řešení"
    ```ts
    import * as gpio from "gpio";
    import { SmartLed, LED_WS2812 } from "smartled";
    import * as colors from "./libs/colors.js"

    const LED_PIN = 48;
    const LED_COUNT = 1;
    const BTN_LEFT = 18;

    const ledStrip = new SmartLed(LED_PIN, LED_COUNT, LED_WS2812);  // připojí pásek na pin 48, s 1 ledkou a typem WS2812

    gpio.pinMode(BTN_LEFT, gpio.PinMode.INPUT); // nastaví pin 18 jako vstup

    gpio.on("falling", BTN_LEFT, () => { // událost, která proběhne při stisknutí tlačítka připojeného na pin 0
        ledStrip.set(0, colors.red); // nastaví barvu nulté LED na červenou (RGB 255 0 0)
        ledStrip.show(); // zobrazí nastavení na LED
    });

    gpio.on("rising", BTN_PIN, () => { // událost, která proběhne při puštění tlačítka připojeného na pin 0
        ledStrip.set(0, colors.off); // nastaví nultou LED na zhasnutou (RGB 0 0 0)
        ledStrip.show(); // zobrazí nastavení na LED
    });
    ```

## Zadání C

Dvakrát za sekundu vypíšeme stav zmáčknutí tlačítka (0 nebo 1). Stav daného tlačítka získáme pomocí `#!ts gpio.read(číslo pinu)`.

Vzpomeňme si z prvního programu, že opakování dosáhneme pomocí `setInterval()`, a informaci vypíšeme pomocí `#!ts console.log()`.

??? note "Řešení"
    ```ts
    import * as gpio from "gpio";

    const LBTN_PIN = 18;

    gpio.pinMode(BTN_PIN, gpio.PinMode.INPUT); // nastaví pin nula jako vstup

    setInterval(() => { // pravidelně vyvolává událost
        console.log(gpio.read(BTN_PIN)); // načte a vypíše stav tlačítka připojeného na pin 0
    }, 500); // čas opakování se udává v milisekundách (500 ms je 0,5 sekundy)
    ```

## Výstupní úkol V1 - Pozdrav

Při stisknutí tlačítka (GPIO 0) vypíšeme pozdrav.

## Výstupní úkol V2 - Změna barvy

Při stisknutí tlačítka (GPIO 0) rozsvítíme RGB LED na ESP32 (`GPIO 48`) jednou barvou a při puštění barvu změníme na jinou.

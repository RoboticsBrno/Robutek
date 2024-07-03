# Lekce 6 - ADC - joystick, potenciometry

V této lekci se naučíme pracovat s ADC převodníkem a zpracovávat data, které pomocí něj získáme.

ADC používáme pro měření napětí, které je výstupem z některých senzorů.
Převádí napětí na hodnotu v rozsahu `0-1023`, kterou pak můžeme dále zpracovávat.

To využijeme pro čtení dat z **potenciometru** a **joysticku**.
Své řešení opět můžeme psát do souborů z předchozích cvičení, nebo stáhnout [novou kostru](./project6.zip).

## Zadání A

Nejprve si napíšeme program, který nám bude číst data z potenciometru a vypisovat je na monitoru.

??? note "Řešení"
    ```ts
    import * as adc from "adc";

    // const INPUT_PIN = 10; // pin joysticku

    const INPUT_PIN = 2 // pin potenciometru

    adc.configure(INPUT_PIN); // nejdříve musíme konfigurovat pin, ze kterého chceme data číst

    setInterval(() => { // každých 100 ms vyčteme data a vypíšeme je do konzole
        const value = adc.read(INPUT_PIN); // pomocí funkce read čteme data z INPUT_PIN
        console.log(value); //vypisujeme hodnotu do konzole
    }, 100);
    ```

## Zadání B

Data už jsme vyčetli, ale většinou je budeme muset ještě upravit.
Ve většině využití totiž nemůžeme použít číslo od `0-1023`.
Proto musíme data takzvaně přemapovat na jiný číselný rozsah, k čemuž si napíšeme funkci.

??? note "Řešení"
    ```ts
    import * as adc from "adc";

    // naše nová funkce, jako parametry má velikost nového rozsahu a číslo, které chceme převést
    function mapADC(targetRange: number, num: number): number {
        let result: number = (num / (1023 / targetRange)); // vypočítame převod na nový rozsah
        return Math.round(result); // výsledek nám často vyjde jako desetinné číslo, proto ho zaokrouhlíme
    }
    const INPUT_PIN = 10;

    adc.configure(INPUT_PIN);

    setInterval(() => {
        const value = mapADC(255, adc.read(INPUT_PIN)); // pomocí naší funkce si namapujeme data na rozsah 0-255
        console.log(value);
    }, 100);
    ```

## Zadání C

Napíšeme program, který bude pomocí dat z potenciometru měnit jas RGB ledky na ESP.

??? note "Řešení"
    ```ts
    import * as adc from "adc";
    import { SmartLed, LED_WS2812 } from "smartled";

    const INPUT_PIN = 2;
    const LED_PIN = 48;
    const LED_COUNT = 1;

    function mapADC(targetRange: number, num: number): number{
        let result: number = (num / (1023/targetRange));
        return Math.round(result);
    }

    const ledStrip = new SmartLed(LED_PIN, LED_COUNT, LED_WS2812);  // připojí pásek na pin 48, s 1 ledkou a typem WS2812
    adc.configure(INPUT_PIN);

    setInterval(() => {
        const value = mapADC(255, adc.read(INPUT_PIN));
        ledStrip.set(0, {r: value, g: 0, b:0}) // nastavíme intenzitu červené barvy na hodnotu z potenciometru (0-255)
        ledStrip.show();
    }, 10);
    ```

## Zadání D

Napíšeme program, který bude číst obě osy joysticku, jedna osa bude ovládat počet svítících ledek na LED pásku, druhá osa jejich barvu.

??? note "Řešení"
    ```ts
    import * as adc from "adc";
    import { SmartLed, LED_WS2812 } from "smartled";
    import * as colors from "./libs/colors.js";

    const JOY_X = 10;
    const JOY_Y = 9;
    const LED_PIN = 21;
    const LED_COUNT = 8;

    function mapADC(rangeFrom: number, rangeTo: number, num: number): number {
        let result: number = (num / (rangeFrom / rangeTo));
        return Math.round(result);
    }

    adc.configure(JOY_X);
    adc.configure(JOY_Y);
    const ledStrip = new SmartLed(LED_PIN, LED_COUNT, LED_WS2812);

    setInterval(() => {
        const lenght = mapADC(1023, 7, adc.read(JOY_X)); // nastaví délku na hodnotu z potenciometru (0-7)
        const ledColor = mapADC(1023, 360, adc.read(JOY_Y)); // nastaví barvu na hodnotu z potenciometru (0-360)
        console.log(`Lenght: ${lenght}, Color: ${ledColor}`);
        ledStrip.clear(); // vymaže pásek
        for (let i: number = 0; i <= lenght; i++) { // nastavíme barvu na všechny ledky v rozsahu délky
            ledStrip.set(i, colors.rainbow(ledColor))
        }
        ledStrip.show();
    }, 10);
    ```

## Výstupní úkol V1

Napíšeme program, který bude pomocí dat ze dvou potenciometrů měnit pozici svítící ledky na LED pásku a její barvu.
Využijeme funkci `#!ts colors.rainbow()`.
<!--
??? note "Řešení"
```ts
import * as adc from "adc";
import { smartled } from "smartled";
import * as colors from "./colors.js"

function mapADC(targetRange: number, num: number): number{
    let result: number = (num / (1023/targetRange));
    return Math.round(result);
}

const POT0 = 2;
const POT1 = 1;
const LED_PIN = 21;
const LED_COUNT = 8;

adc.configure(POT0);
adc.configure(POT1);
const ledStrip = new smartled(LED_PIN, LED_COUNT);

setInterval(() => {
    const ledPos = mapADC(7, adc.read(POT0));
    const ledColor = mapADC(360, adc.read(POT1));
    ledStrip.clear();
    ledStrip.set(ledPos, colors.rainbow(ledColor))
    ledStrip.show();
}, 10);
``` -->













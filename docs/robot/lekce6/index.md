# Lekce 6 - ADC - senzory čáry, senzory kolem kol 

V této lekci se naučíme pracovat s ADC převodníkem a zpracovávat data, které pomocí něj získáme.

ADC používáme pro měření napětí, které je výstupem z některých senzorů.
Převádí napětí na hodnotu v rozsahu `0-1023`, kterou pak můžeme dále zpracovávat.

To využijeme pro čtení dat ze **senzorů čáry** a **senzorů kolem kol**.
Své řešení opět můžeme psát do souborů z předchozích cvičení, nebo stáhnout [novou kostru](./project6.zip).

Nejprve se naučíme, jak číst data z jednoho senzoru ze senzorů kolem kol a vypisovat je na monitoru:

```ts
import * as gpio from "gpio";
import * as adc from "adc";

const SENSOR_PIN: number  = 4; // pin levého předního senzoru u kola z pohledu zvrchu
const LIGHTN_PIN: number  = 47; // pin na zapnutí podsvícení pro senzory

adc.configure(SENSOR_PIN); // nakonfigurujeme pin senzoru

gpio.pinMode(LIGHTN_PIN, gpio.PinMode.OUTPUT); // nastavíme mód pinu podsvícení na output 
gpio.write(LIGHTN_PIN, 1); // zapneme podsvícení robůtka

setInterval(() => { // každých 100 ms vyčteme data a vypíšeme je do konzole
    const value = adc.read(SENSOR_PIN); // pomocí funkce read čteme data z SENZOR_PIN
    console.log(value); //vypisujeme hodnotu do konzole
}, 100);
```

## Zadání A

Data už jsme vyčetli, ale většinou je budeme muset ještě upravit.
Ve většině využití totiž nemůžeme použít číslo od `0-1023`.
Proto musíme data takzvaně přemapovat na jiný číselný rozsah, k čemuž si napíšeme funkci.

??? note "Řešení"
    ```ts
    import * as gpio from "gpio";
    import * as adc from "adc";

    // naše nová funkce, jako parametry má velikost nového rozsahu a číslo, které chceme převést
    function mapADC(targetRange: number, num: number): number {
        let result: number = (num / (1023 / targetRange)); // vypočítame převod na nový rozsah
        return Math.round(result); // výsledek nám často vyjde jako desetinné číslo, proto ho zaokrouhlíme
    }

    const SENSOR_PIN: number  = 4; // pin levého předního senzoru u kola z pohledu zvrchu
    const LIGHTN_PIN: number  = 47; // pin na zapnutí podsvícení pro senzory

    adc.configure(SENSOR_PIN); // nakonfigurujeme pin senzoru

    gpio.pinMode(LIGHTN_PIN, gpio.PinMode.OUTPUT); // nastavíme mód pinu podsvícení na output 
    gpio.write(LIGHTN_PIN, 1); // zapneme podsvícení robůtka

    setInterval(() => {
        const value: number  = mapADC(255, adc.read(SENSOR_PIN)); // pomocí naší funkce si namapujeme data na rozsah 0-255
        console.log(value);
    }, 100);
    ```

## Zadání B

Napíšeme program, který bude pomocí dat z senzoru kolem kol měnit jas RGB LED pásek.

??? note "Řešení"
    ```ts
    import * as adc from "adc";
    import * as gpio from "gpio";
    import { SmartLed, LED_WS2812 } from "smartled";

    const SENSOR_PIN: number  = 4; // pin levého předního senzoru 
    const LIGHTN_PIN: number  = 47; // pin na zapnutí podsvícení pro senzory

    const LED_PIN: number  = 48;
    const LED_COUNT: number  = 1+8; // LED světlo na desce robůtka plus led světla na RGB pásku

    function mapADC(targetRange: number, num: number): number{
        let result: number = (num / (1023/targetRange));
        return Math.round(result);
    }

    const ledStrip: SmartLed  = new SmartLed(LED_PIN, LED_COUNT, LED_WS2812);  // připojí pásek na pin LED_PIN, s LED_COUT ledkami a typem WS2812
    adc.configure(SENSOR_PIN); // nakonfigurujeme pin senzoru

    gpio.pinMode(LIGHTN_PIN, gpio.PinMode.OUTPUT); // nastavíme mód pinu podsvícení na output 
    gpio.write(LIGHTN_PIN, 1); // zapneme podsvícení robůtka

    setInterval(() => {
        const value: number  = mapADC(255, adc.read(SENSOR_PIN));
        
        for(let i = 0; i<LED_COUNT; i++) {
            ledStrip.set(i, {r: value, g: (255 - value*8), b: 0}) // nastavíme intenzitu červené barvy na hodnotu z Senzoru čáry (0-255) a zároveň čím více se povrch pod robůtkem bude blížit bílé tím více bude barva fialová
        }
        
        ledStrip.show();
    }, 10); 
    ```

## Zadání C
Senzorů čáry a senzorů kolem kol je dohromady 8, ale pro zmenšení počtu využitých pinů na ESP jsou namapované jen na 4 piny a jeden přepínací. Nastavením tohoto pinu změníme, zda měříme na přední straně robota, nebo senzory kolem kol. Teď si napíšeme program, který místo pravého předního senzoru u kola přečte pravý přední senzor čáry.

![](assets/IMG-back.png)

??? note "Řešení"
    ```ts
    import * as adc from "adc";
    import * as gpio from "gpio";

    const SENSOR_PIN: number  = 4; // pin levého předního senzoru 
    const LIGHTN_PIN: number  = 47; // pin na zapnutí podsvícení pro senzory
    const SENSOR_SWITCH_PIN: number  = 8; // pin na přepnutí mezi senzory u kola a senzory čáry

    adc.configure(SENSOR_PIN); // nakonfigurujeme pin senzoru

    gpio.pinMode(LIGHTN_PIN, gpio.PinMode.OUTPUT); // nastavíme mód pinu podsvícení na output 
    gpio.pinMode(SENSOR_SWITCH_PIN, gpio.PinMode.OUTPUT);

    gpio.write(LIGHTN_PIN, 1); // zapneme podsvícení robůtka
    gpio.write(SENSOR_SWITCH_PIN, 1); // přepneme na senzory čáry

    setInterval(() => { // každých 100 ms vyčteme data a vypíšeme je do konzole
        console.log(adc.read(SENSOR_PIN));
    }, 100);
    ```

## Výstupní úkol V1

Napište program, který vypíše hodnotu v rozsahu -1 až 1 na základě toho, zda je robot napravo nebo nalevo od čáry. Tzn. program, který vypíše do konzole 1, když černou čáru vidí jenom pravé senzory, a -1, když čáru vidí jenom levé senzory. Pokud černou vidí jen část senzorů na dané straně, vrátí hodnotu mezi 0 a 1 (-1). Pokud černou nevidí vůbec, vypíše 0. 
<!--
??? note "Řešení"
```ts
import * as gpio from "gpio";
import * as adc from "adc";

function mapADC(targetRange: number, num: number): number {
    let result: number = (num / (1023 / targetRange)); // vypočítame převod na nový rozsah
    return result; // výsledek nám často vyjde jako desetinné číslo, proto ho zaokrouhlíme
}

const RIGHT_UP_PIN: number  = 4;
const RIGHT_DOWN_PIN: number  = 5;
const LEFT_UP_PIN: number  = 6;
const LEFT_DOWN_PIN: number  = 7;
const PIN_LENT: number  = 47 // pin podsvícení
const PIN_SWITCH: number  = 8 // pin přepínaní mezi krajními a prostředními senzory


adc.configure(RIGHT_UP_PIN, adc.Attenuation.Db0);
adc.configure(RIGHT_DOWN_PIN, adc.Attenuation.Db0);
adc.configure(LEFT_UP_PIN, adc.Attenuation.Db0);
adc.configure(LEFT_DOWN_PIN, adc.Attenuation.Db0);

gpio.pinMode(PIN_SWITCH, gpio.PinMode.OUTPUT);
gpio.pinMode(PIN_LENT, gpio.PinMode.OUTPUT);

gpio.write(PIN_SWITCH, 1); // zakomentovat jestli chceme krajní senzory
gpio.write(PIN_LENT, 1);

setInterval(() => { // každých 100 ms vyčteme data a vypíšeme je do konzole
    let right_up_value: number = adc.read(RIGHT_UP_PIN);
    let right_down_value: number = adc.read(RIGHT_DOWN_PIN);
    let left_up_value: number = adc.read(LEFT_UP_PIN);
    let left_down_value: number = adc.read(LEFT_DOWN_PIN);

    right_up_value = mapADC(0.5, right_up_value);
    right_down_value = mapADC(0.5, right_down_value);
    left_up_value = mapADC(0.5, left_up_value);
    left_down_value = mapADC(0.5, left_down_value);

    let right_value: number = right_up_value + right_down_value;
    let left_value: number = left_up_value + left_down_value;

    let result: number =  right_value - left_value; 
    
    console.log(result); 
    
}, 1000);
``` -->













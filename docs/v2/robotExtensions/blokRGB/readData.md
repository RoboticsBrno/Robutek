# Měření

Pro měření využejeme funkce `readCalRGB()`. Tato funkce nám vráti kalibrované data v rozsahu `0-1`. Formát vrácených dat však přimo neodpovídá formátu, který očekává knihovna `SmartLeds`. K převodu mezi nimi využijeme funkci `sensorDataToRGB(SENSOR_DATA)` z knihovny `colors`. S formátem RGB už můžeme pracovat pohodlně.

```ts
// vyčteme kalibrovaná data, funkce vrací pole se 3 hodnotami 0-1
const sensorData = sensor.readCalRGB();

// provedeme převod na formát RGB
const rgb = colors.sensorDataToRGB(sensorData);

/*
takto může vypadat objekt rgb (toto je fialová barva)
{
    r: 255,
    g: 0,
    b: 255,
}

*/
```

!!! note "Další funkce"

    Knihovna umožňuje také měření jednotlivých barevných kanálů: `readRed()`, `readGreen()`, `readBlue()`, `readIR()`, `readClear()`. Pro čtení hodnot na RGB kanálech je však efektivnější použít funkci `readCalRGB()`.


### Příklad 1

Vytvoř program, který bude do konzole vypisovat hodnoty ve formátu, který očekává vizualizér [JacViz](https://viz.jaculus.org). Umožňuje vykreslit aktuální barvu měřenou senzorem.

Očekávaný formát se skládá ze samostatných řádků, které odpovídají jednotlivým měřením:

```
r: 123, g: 234, b: 45
```

??? note "Řešení"

    ```ts
    import * as colors from "./libs/colors.js";
    import { I2C1 } from "i2c";
    import { ZSCS2016C, Calibration } from "./libs/zscs2016c.js";
    import { LED_WS2812B, SmartLed } from "smartled";
    import { createRobutek } from "./libs/robutek.js";

    const robutek = createRobutek("V2");

    I2C1.setup({ sda: robutek.Pins.SDA, scl: robutek.Pins.SCL, bitrate: 400000 });
    const sensor = new ZSCS2016C(I2C1, false);

    const ledStrip = new SmartLed(robutek.Pins.ILED, 7, LED_WS2812B);
    ledStrip.set(1, { r: 255, g: 255, b: 255 });
    ledStrip.set(2, { r: 255, g: 255, b: 255 });
    ledStrip.show();

    sensor.enable();
    sensor.loadCalibration("default");

    setInterval(() => {
        const calData = sensor.readCalRGB();
        const rgb = colors.sensorDataToRGB(calData);
        console.log(`r: ${rgb.r}, g: ${rgb.g}, b: ${rgb.b}`);
    }, 50);
    ```

### Příklad 2

Vytvoř program, který mění barvu LED na desce na barvu, kterou měří senzor. Pokud používáme vestavěný senzor, není vhodné měnit barvu ledek, kterou jsou přímo vedle něj.

??? note "Řešení"

    ```ts
    import * as colors from "./libs/colors.js";
    import { I2C1 } from "i2c";
    import { ZSCS2016C, Calibration } from "./libs/zscs2016c.js";
    import { LED_WS2812B, SmartLed } from "smartled";
    import { createRobutek } from "./libs/robutek.js";

    const robutek = createRobutek("V2");

    I2C1.setup({ sda: robutek.Pins.SDA, scl: robutek.Pins.SCL, bitrate: 400000 });
    const sensor = new ZSCS2016C(I2C1, false);

    const ledStrip = new SmartLed(robutek.Pins.ILED, 7, LED_WS2812B);
    ledStrip.set(1, { r: 255, g: 255, b: 255 });
    ledStrip.set(2, { r: 255, g: 255, b: 255 });
    ledStrip.show();

    sensor.enable();
    sensor.loadCalibration("default");

    setInterval(() => {
        const calData = sensor.readRGB();
        const rgb: colors.Rgb = colors.sensorDataToRGB(calData);
        ledStrip.set(0, rgb);
        ledStrip.show();
    }, 50);
    ```

### Možné pokračování

- Udělej program, který bude měřit barvu předmětu před senzorem a "pozná", o jakou barvu se jedná. Pokud před něj dáme zelený předmět, vypíše nám do konzole "zelená" atd...

# Měření

Pro měření využejeme funkce `readRGB()`. Tato funkce nám vráti kalibrované data v rozsahu `0-1`. Formát vrácených dat však přimo neodpovídá formátu, který očekává knihovna `SmartLeds`. K převodu mezi nimi využijeme funkci `sensorDataToRGB(SENSOR_DATA)` z knihovny `colors`.

```ts
// vyčteme kalibrovaná data, funkce vrací pole se 3 hodnotami 0-1
const sensorData = sensor.readRGB();

// provedeme převod na formát Color
const color = colors.sensorDataToRGB(sensorData);
```

!!! note "Další funkce"

    Knihovna umožňuje také měření jednotlivých barevných kanálů: `readRed()`, `readGreen()`, `readBlue()`, `readIR()`, `readClear()`. Pro čtení hodnot na RGB kanálech je však efektivnější použít funkci `readRGB()`.


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
    import { ZSCS2016C } from "./libs/zscs2016c.js";
    import { LED_WS2812B, SmartLed } from "smartled";
    import * as colors from "./libs/colors.js";
    import { createRobutek } from "./libs/robutek.js";

    const robutek = createRobutek("V2");

    I2C1.setup({ sda: robutek.Pins.SDA, scl: robutek.Pins.SCL, bitrate: 400000 });
    const sensor = new ZSCS2016C(I2C1, true);

    const ledStrip = new SmartLed(robutek.Pins.ILED, 7, LED_WS2812B);
    ledStrip.set(1, colors.rgb(255, 255, 255));
    ledStrip.set(2, colors.rgb(255, 255, 255));
    ledStrip.show();

    sensor.enable();
    sensor.loadCalibration("default");

    setInterval(() => {
        const calData = sensor.readRGB();
        const [r, g, b] = calData;
        console.log(`r: ${r}, g: ${g}, b: ${b}`);
    }, 50);
    ```

### Příklad 2

Vytvoř program, který mění barvu LED na desce na barvu, kterou měří senzor. Pokud používáme vestavěný senzor, není vhodné měnit barvu ledek, kterou jsou přímo vedle něj.

??? note "Řešení"

    ```ts
    import * as colors from "./libs/colors.js";
    import { I2C1 } from "i2c";
    import { ZSCS2016C } from "./libs/zscs2016c.js";
    import { LED_WS2812B, SmartLed } from "smartled";
    import * as colors from "./libs/colors.js";
    import { createRobutek } from "./libs/robutek.js";

    const robutek = createRobutek("V2");

    I2C1.setup({ sda: robutek.Pins.SDA, scl: robutek.Pins.SCL, bitrate: 400000 });
    const sensor = new ZSCS2016C(I2C1, true);

    const ledStrip = new SmartLed(robutek.Pins.ILED, 7, LED_WS2812B);
    ledStrip.set(1, colors.rgb(255, 255, 255));
    ledStrip.set(2, colors.rgb(255, 255, 255));
    ledStrip.show();

    sensor.enable();
    sensor.loadCalibration("default");

    setInterval(() => {
        const calData = sensor.readRGB();
        const color = colors.sensorDataToRGB(calData);
        ledStrip.set(0, color);
        ledStrip.show();
    }, 50);
    ```

### Možné pokračování

- Napište program, který bude měřit barvu předmětu před senzorem a "pozná", o jakou barvu se jedná. Pokud před něj dáme zelený předmět, vypíše nám do konzole "zelená" atd.

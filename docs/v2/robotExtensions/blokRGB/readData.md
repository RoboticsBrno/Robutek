# Měření

Pro měření využejeme funkce `readCalRGB()`. Tato funkce nám vráti kalibrované data v rozsahu `0-1`. Hodnoty v rozsahu `0-1` však nemusejí být pro nás ideální. Nejedná se totiž o standardní formát, takže z něj nedokážeme přímo vyčíst barvu. Proto chceme většinou hodnoty upravit na klasický formát RGB. K tomu využijeme funkci `sensorDataToRGB(SENSOR_DATA)` z knihovny `colors`. S formátem RGB už můžeme pracovat pohodlně.

```ts
// vyčteme kalibrované data, funkce vrací pole se 3 hodnotami 0-1
const sensorData = sensor.readCalRGB();

// funkce nám upraví rozsah 0-1 na rozsah 0-255, tedy standardní RGB formát; vrátí nám objekt typu Rgb
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

    Knihovna umožňuje také měření jednotlivých barevných kanálu: `readCalRed()`, `readCalGreen()`, `readCalBlue()`, `readCalIR()`, `readCalClear()`.

### Příklad

Udělejte program, který kazdých 500ms vypíše, jakou barvu senzor právě snímá.

<!-- TODO change task to display color on LED  -->

??? note "Řešení"

    ```ts
    import * as colors from "./libs/colors.js";
    import { I2C1 } from "i2c";
    import { ZSCS2016C, Calibration } from "./libs/zscs2016c.js";
    import { createRobutek } from "./libs/robutek.js"

    const robutek = createRobutek("V2");

    I2C1.setup({ sda: robutek.Pins.sda, scl: robutek.Pins.scl, bitrate: 400000 });

    const sensor = new ZSCS2016C(I2C1, false);
    sensor.enable();

    const calib: Calibration = {
    mins: [3426, 7332, 4844, 529, 15877],
    maxs: [62644, 65535, 65535, 13320, 6555],
    };
    sensor.setCalibration(calib);

    setInterval(() => {
        const calData = sensor.readCalRGB();
        const rgb: colors.Rgb = colors.sensorDataToRGB(calData);
        console.log(`red: ${rgb.r} green: ${rgb.g} blue: ${rgb.b}`);

    }, 500);
    ```

<!-- TODO add more tasks -->

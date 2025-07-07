# Kalibrace

Dříve, než začneme se senzory měřit, musíme je zkalibrovat. Kalibrace nám poskytne hodnoty v rozsahu `0-1`, které jsou upravené tak, aby samé nuly odpovídaly černé a samé jedničky odpovídaly bílé. Hodnoty tak budou více odpovídat skutečné barvě povrchu pod senzorem.

Tato jsou funkce, které ke kalibraci použijeme.

```ts
const sensor = new ZSCS2016C(I2C1, ADDR_BIT);

// zahájí kalibrační cyklus pro senzor a aplikuje kalibrační hodnoty
await sensor.runCalibration();

// perzistentně uloží kalibrační hodnoty pod zadaným klíčem
sensor.saveCalibration("key");

// načte kalibrační hodnoty z paměti pod zadaným klíčem
sensor.loadCalibration("key");
```

Kalibrační program využívající tyto funkce pak vypadá takto. Tento program nám vypíše kalibrační hodnoty pro náš senzor za současných podmínek. Procesem kalibrace nás program provede zprávami v terminálu.

```ts
import { I2C1 } from "i2c";
import { ZSCS2016C } from "./libs/zscs2016c.js";
import { createRobutek } from "./libs/robutek.js"
import { SmartLed, LED_WS2812B } from "smartled";

const robutek = createRobutek("V2");

I2C1.setup({ sda: robutek.Pins.SDA, scl: robutek.Pins.SCL, bitrate: 400000 });
const sensor = new ZSCS2016C(I2C1, true);

const ledStrip = new SmartLed(robutek.Pins.ILED, 7, LED_WS2812B);

ledStrip.set(1, { r: 255, g: 255, b: 255 });
ledStrip.set(2, { r: 255, g: 255, b: 255 });
ledStrip.show();

sensor.enable();

async function main() {
    // spustí se kalibrační proces
    await sensor.runCalibration();
    console.log(`Calibration data: ${JSON.stringify(sensor.getCalibration())}`);

    // uloží kalibrační hodnoty pod klíčem 'default'
    sensor.saveCalibration("default");
}

main().catch(console.error);

```

!!! note "Takto může vypadat objekt s kalibračními hodnotami"

    ```ts
    {
        mins: [3426,7332,4844,529,15877],
        maxs: [62644,65535,65535,13320,65535]
    }
    ```

Kalibraci je nutné provádět pouze jednou. Poté se perzestentně ukládají paměti pod zadaným klíčem. Stejným pomocí stejného klíče je pak možné kalibraci znovu načíst a použít. Je také možné uložit více kalibrací pod různými klíči a podle potřeby je přepínat.

```ts

import { I2C1 } from "i2c";
import { ZSCS2016C } from "./libs/zscs2016c.js";
import { createRobutek } from "./libs/robutek.js"
import { SmartLed, LED_WS2812B } from "smartled";

const robutek = createRobutek("V2");

I2C1.setup({ sda: robutek.Pins.SDA, scl: robutek.Pins.SCL, bitrate: 400000 });
const sensor = new ZSCS2016C(I2C1, true);

const ledStrip = new SmartLed(robutek.Pins.ILED, 7, LED_WS2812B);
ledStrip.set(1, { r: 255, g: 255, b: 255 });
ledStrip.set(2, { r: 255, g: 255, b: 255 });
ledStrip.show();

sensor.enable();
sensor.loadCalibration("default");

setInterval(() => {
    console.log(`${JSON.stringify(sensor.readRGB())}`);
}, 1000);

```

!!! warning "POZOR"

    Kalibrace probíhá pro specifické podmínky, jako třeba množství světla či _vzdálenost od měřeného povrchu_. Pokud například provedete kalibraci se senzorem 1cm od povrchu a měření 2cm od povrchu, měřené data nebudou odpovídat dané barvě.

[Měření](readData.md){ .md-button .md-button--primary }

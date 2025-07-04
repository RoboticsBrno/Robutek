# Kalibrace

Dříve, než začneme se senzory měřit, musíme je zkalibrovat. Kalibrace nám poskytne hodnoty, podle kterých mapujeme naměřená data ze senzoru na rozsah `0-1`. S tímto rozsahem se nám totiž lépe pracuje.

Tato jsou funkce, které ke kalibraci použijeme.

```ts
const sensor = new ZSCS2016C(I2C1, ADDR_BIT);

// zahájí kalibrační cyklus pro senzor,
// vrací objekt typu Calibration
sensor.calibrate();

// jako parametr bere objekt typu Calibration,
// který nám vrací funkce calibrate(), nastaví
// korekci senzoru podle kalibrace
sensor.setCalibration(CALIBRATION_OBJECT);

// vypíše do konzole pole kalibračnich hodnot
sensor.printCalib();
```

Kalibrační program využívající tyto funkce pak vypadá takto. Tento program nám vypíše kalibrační hodnoty pro náš senzor za současných podmínek. Procesem kalibrace nás program provede zprávami v terminálu.

```ts
import { I2C1 } from "i2c";
import { ZSCS2016C } from "./libs/zscs2016c.js";
import { createRobutek } from "./libs/robutek.js"

const robutek = createRobutek("V2");

I2C1.setup({ sda: robutek.Pins.SDA, scl: robutek.Pins.SCL, bitrate: 400000 });
const sensor = new ZSCS2016C(I2C1, false);

sensor.enable();

async function main() {
  sensor.setCalibration(await sensor.calibrate());
  sensor.printCalib();
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

Kalibraci je nutné provádět pouze jednou. Poté si totiž hodnoty manuálně uložíme, a v příštích programech je pouze nastavíme pomocí funkce `setCalibration(CALIBRATION_OBJECT)`.

```ts
import { I2C1 } from "i2c";
import { ZSCS2016C, Calibration } from "./libs/zscs2016c.js";
import { createRobutek } from "./libs/robutek.js"

const robutek = createRobutek("V2");

I2C1.setup({ sda: robutek.Pins.SDA, scl: robutek.Pins.SCL, bitrate: 400000 });
const sensor = new ZSCS2016C(I2C1, false);
sensor.enable();

const calib: Calibration = {
  mins: [3426, 7332, 4844, 529, 15877],
  maxs: [62644, 65535, 65535, 13320, 6555],
};
sensor.setCalibration(calib);
```

!!! warning "POZOR"

    Kalibrace probíhá pro specifické podmínky, jako třeba množství světla či _vzdálenost od měřeného povrchu_. Pokud například provedete kalibraci se senzorem 1cm od povrchu a měření 2cm od povrchu, měřené data nebudou odpovídat dané barvě.

[Měření](readData.md){ .md-button .md-button--primary }

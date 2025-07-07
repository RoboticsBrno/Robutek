# Inicializace senzoru

=== "Odkaz"
    ```
    https://robutek.robotikabrno.cz/v2/robot/blank_project.tar.gz
    ```
=== "Zip"
    [Stáhnout ZIP](../../robot/blank_project.zip){ .md-button .md-button--primary }


Prvním krokem je nastavení komunikace přes I2C.

<!--
[Pokročilý pohled na I2C ](../blokI2C/index.md){ .md-button }
-->

!!! note "Pokud prohodíme SDA a SCL, komunikace nebude fungovat"

```ts
import { I2C1 } from "i2c";
import { createRobutek } from "./libs/robutek.js"

const robutek = createRobutek("V2");

I2C1.setup({ sda: robutek.Pins.SDA, scl: robutek.Pins.SCL, bitrate: 400000 });
```

Poté musíme senzor inicializovat a povolit.

```ts
import { ZSCS2016C } from "./libs/zscs2016c.js";

const sensor = new ZSCS2016C(I2C1, addrBit);
sensor.enable();
```

Parametr `addrBit` specifikuje, jestli chceme komunikovat se senzorem na desce nebo externím senzorem.

```ts
const sensor = new ZSCS2016C(I2C1, true); // senzor na desce
const sensor = new ZSCS2016C(I2C1, false); // externí senzor
```

Knihovna pro senzor nám dává několik funkcí. Tyto funkce tvoří 3 hlavní skupiny:
- **Kalibrace** - funkce pro kalibraci senzoru
- **Čtení dat** - funkce pro čtení dat ze senzoru s kalibrací
- **Nekalibrované čtení dat** - funkce pro čtení dat ze senzoru bez kalibrace

!!! note "RGB knihovna pro zájemce"

    Pokud vás zajímá, jak funkce fungují, můžete si pročíst soubor knihovny. Pokud nevíte co děláte, knihovnu nepřepisujte, nebude vám fungovat.

[Kalibrace](calibration.md){ .md-button .md-button--primary }

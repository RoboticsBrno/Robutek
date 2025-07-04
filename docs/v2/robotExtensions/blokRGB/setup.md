# Inicializace senzoru

Prvním krokem je nastavení komunikace přes I2C.

[Pokročilý pohled na I2C ](../blokI2C/index.md){ .md-button .md-button--primary }

!!! note "Pokud prohodíme SDA a SCL, komunikace nebude fungovat"

```ts
import { I2C1 } from "i2c";
I2C1.setup({ sda: 10, scl: 3, bitrate: 400000 });
```

Poté musíme senzor inicializovat a povolit.

```ts
import { ZSCS2016C } from "./libs/zscs2016c.js";

const sensor = new ZSCS2016C(I2C1, ADDR_BIT);
sensor.enable();
```

Parametr `ADDR_BIT` specifikuje, jestli chceme komunikovat se senzorem na desce nebo externím senzorem.

```ts
const sensor = new ZSCS2016C(I2C1, true); // senzor na desce

const sensor = new ZSCS2016C(I2C1, false); // externí senzor
```

Knihovna pro senzor nám dává několik funkcí. Můžeme si je rozdělit do 2 skupin - kalibrační a měřící funkce

!!! note "RGB knihovna pro zájemce"

    Pokud vás zajímá, jak funkce fungují, můžete si pročíst soubor knihovny. Pokud nevíte co děláte, knihovnu nepřepisujte, nebude vám fungovat

[Kalibrace](calibration.md){ .md-button .md-button--primary }

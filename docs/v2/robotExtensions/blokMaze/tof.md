# Senzor vzdálenosti VL53L0X

K robůtkovi lze připojit dálkoměr VL53L0X, který umožňuje opticky měřit vzdálenost. S dálkoměrem se komunikuje skrze I2C sběrnici. Protože je protokol pro ovládání dálkoměru složitý[^1], použijeme ke komunikaci knihovnu `VL53L0X.ts`[^2].

[^1]: Podle výrobce dokonce tak složitý, že k němu nelze dobře sepsat specifikaci (ve skutečnosti to bude nejspíš pouze neschopnost výrobce ať už kvůli špatnému návrhu protokolu, nebo neochotě sepsat dokumentaci).

[^2]: Dodávaná knihovna je upravenou verzí knihovny [VL53L0X.js](https://www.espruino.com/VL53L0X) od Espruino tak, aby fungovala v Jaculu

## Import knihovny

Nejprve si musíme knihovnu importovat. Zároveň budeme také potřebovat importovat modul `i2c` pro komunikaci přes I2C sběrnici. To uděláme pomocí příkazu `import`:

```ts
import { I2C1 } from "i2c"
import { VL53L0X } from "./libs/VL53L0X.js"
```

## Konfigurace dálkoměru

Po naimportování knihovny získáme konstruktor třídy `VL53L0X`, kterým můžeme vytvořit nový objekt dálkoměru. Také získáme objekt `I2C1`, který slouží k ovládání I2C sběrnice. Sběrnici musíme nejprve nakonfigurovat a následně můžeme vytvořit objekt dálkoměru.

```ts
// Konfigurace I2C sběrnice na správných pinech.
I2C1.setup({sda: robutek.Pins.SDA, scl: robutek.Pins.SCL, bitrate: 400000});

// Vytvoření objektu dálkoměru
const vl = new VL53L0X(I2C1);
```

## Dostupné rozhraní

Po vytvoření objektu dálkoměru můžeme začít s měřením vzdálenosti. K dispozici máme pouze jednu metodu:

- `async read(): Promise<Measurement>` - zahájí měření vzdálenosti a vrátí naměřenou hodnotu v milimetrech. Měření vzdálenosti chvíli trvá, funkce je tedy asynchronní a je potřeba použít `await`. Funkce na konci měření vrací objekt typu `Measurement`, který obsahuje naměřenou hodnotu a informace o výsledku měření.


## Příklad použití

Nyní si ukážeme, jak můžeme měřit vzdálenost pomocí dálkoměru VL53L0X. Následující program bude každou vteřinu měřit vzdálenost a vypisovat informace o měření do monitoru.

```ts
import { I2C1 } from "i2c";
import { VL53L0X } from "./libs/VL53L0X.js"
import { stdout } from "stdio";
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V2");; // ovládání motorů
    
I2C1.setup({sda: robutek.Pins.SDA, scl: robutek.Pins.SCL, bitrate: 400000});
const vl = new VL53L0X(I2C1);

async function main() {
    while (true) {
        const m = await vl.read();
        console.log("Distance: " + m.distance + " mm  \tSignal: " + m.signalRate + "\tAmb: " + m.ambientRate + "\tSPAD: " + m.effectiveSpadRtnCount);
    }
}

main().catch(console.error);
```

Výpis potom může vypadat například takto:

```
Distance: 203 mm        Signal: 10.671875       Amb: 1.265625   SPAD: 177
Distance: 199 mm        Signal: 11.265625       Amb: 1.203125   SPAD: 177
Distance: 203 mm        Signal: 10.9765625      Amb: 1.234375   SPAD: 177
```

- proměnná `m.distance` obsahuje naměřenou vzdálenost v milimetrech,
- proměnná `m.signalRate` obsahuje informaci o kvalitě signálu,
- proměnná `m.ambientRate` obsahuje informaci o okolním šumu,
- proměnná `m.effectiveSpadRtnCount` obsahuje informaci o počtu aktivních pixelů (z těch se skládá senzor a zapíná je podle toho, jakou vzdálenost a v jakém prostředí měří).


[3. Pohled na logiku procházení ](logic.md){ .md-button .md-button--primary }

<!-- 
[Pokročilý pohled na I2C ](../blokI2C/index.md){ .md-button }
-->
# Pohled na senzory čáry
Na robůtkovi je zespoda 8 senzorů čáry:
![](assets/senzory.jpg)
Nás budou zajímat zejména senzory LineFL a LineFR.

# Jak se senzory pracovat

Hodnotu ze senzoru jde vyčíst následujícím způsobem

```ts
const l = robutek.readSensor("WheelFL");
const r = robutek.readSensor("WheelFR");
```

Načtené hodnoty si můžeme jednoduše vypsat

```ts
console.log(`l: ${l}, r: ${r}`);
```
Celý program na vyzkoušení senzorů může vypadat třeba takto:
```ts
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V2");
async function main() {
    while(true) {
        const l = robutek.readSensor("LineFL");
        const r = robutek.readSensor("LineFR");
        console.log(`l: ${l}, r: ${r}`);
        await sleep(500); // Nechceme zahltit počítač
    }
}
main().catch(console.error);
```


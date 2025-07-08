# Pohled na senzory čáry
Na robůtkovi je zespoda 8 senzorů čáry. Hodnota každého senzoru může teoreticky nabývat hodnot od 0 (absolutní černá) do 1023 (nejbělejší bílá), V praxi se ale hodnota většinou pohybuje někde mezi těmato dvěmi mezemi. Senzory na robůtkovi jsou na desce označeny názvy A1-A4 a B1-B4. Skupina A je vepředu a kolem středové díry, a skupina B je kolem kol. Čtení ze senzorů je rychlé, pokud čteme ze senzorů jedné z těch dvou skupin, pokud bychom ale například načetli hodnotu ze senzoru A2 a poté B4, tak čtení senzoru B4 zabere minimálně 2 milisekundy.
??? note "Proč to zpomalení"
    Hodnoty ze senzorů se měří pomocí analogově-digitálních převodníků (ADC) na ESP a proto je pro každý senzor potřeba zvláštní pin. Aby nebylo potřeba tolik pinů jenom pro senzory, používá se pro komunikaci s nimi tzv. multiplexing. V jednu chvíli je možné číst senzory jenom z jedné skupiny (používají se 4 piny + jeden na volbu skupin). Skupinu můžeme přepínat, ale bezprostředně po přepnutí je výsledek měření nespolehlivý, a proto knihovna Robůtka čeká 2 milisekundy.
![](assets/senzory.jpg)
Nás budou zajímat zejména senzory LineFL a LineFR.

# Jak se senzory pracovat

Hodnotu ze senzoru jde vyčíst následujícím způsobem

```ts
const l = robutek.readSensor("LineFL");
const r = robutek.readSensor("LineFR");
```

Načtené hodnoty si můžeme jednoduše vypsat

```ts
console.log(`l: ${l}; r: ${r}`);
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
!!! tip "Běžte na [viz.jaculus.org](https://viz.jaculus.org) a uvidíte grafickou vizualizaci výstupu ze senzorů."

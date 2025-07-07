# Lekce 6 - Cykly

V této lekci si představíme cykly. Ty nám umožňují opakovat kód podle nějakého pravidla.
Zatím je využijeme pro komunikaci s robotem, v následující lekci si ukážeme jejich použití při řízení robota.

Máme primárně dva typy cyklů:

- `#!ts for()` využijeme, když víme počet opakování
- `#!ts while()` využijeme, když nevíme počet opakování

### Cyklus for

Cyklus `#!ts for` můžeme napsat takto:

```ts
for (let i: number = 0; i < 3; i++) {
  // opakovaný kód
}
```

Do kulatých závorek píšeme tři věci:

- řídící proměnnou s její výchozí hodnotou
- výraz, který určuje počet opakování
- nakonec jednoduchou operaci, která se provede při každém průchodu cyklem jako poslední operace

Tedy vytváříme proměnnou `#!ts i` s výchozí hodnotou `#!ts 0`, která bude existovat po dobu vykonávání cyklu.
Ačkoliv v běžném životě počítáme věci od `1`, v informatice častěji začínáme `0`. Může zde však být cokoliv.

Následně definujeme výraz `#!ts i < 3 `, který určuje, za jakých podmínek má cyklus běžet.

Na konci cyklu zvýšíme `#!ts i ` o jedna.

Při prvním průchodu bude tedy `#!ts i = 0`, při druhém `#!ts i = 1`, a při třetím `#!ts i = 2`. Při dalším zvyšování by platilo `#!ts i = 3`, tam ale už nebude pravdivý výraz `i < 3` a cyklus se tedy ukončí.

Do složených závorek píšeme vykonávaný kód, který se v tomto případě vykoná 3-krát.

## Zadání A

Ve spojení se znalostmi z minulých lekcí napište program, který po stisku tlačítka vypíše čísla 0 až 9 (pomocí `#!ts console.log(CISLO)`), vždy na samostatný řádek. Využijte cyklus.

??? note "Řešení"

    ```ts
    import * as gpio from "gpio";

    gpio.pinMode(BTN_PIN, gpio.PinMode.INPUT); // nastaví pin 0 jako vstup

    gpio.on("falling", BTN_PIN, () => { // událost, která proběhne při stisknutí tlačítka připojeného na pin 0
    	console.log("Stisknuto, začínáme počítat");
    	for (let i: number = 0; i < 9; i++) { // vypíšeme čísla od 0 do 8
    		console.log(i);
    	}
    	console.log(""); // oddělíme jednotlivé stisky
    });
    ```

## Cyklus while

Pokud nevíme, kolikrát se má cyklus opakovat, použijeme místo cyklu `#!ts for ` cyklus `#!ts while `.

Do kulatých závorek teď píšeme jen výraz, který určuje, jestli se cyklus vykoná znovu, nebo ne. Funguje prakticky jako podmínka, která se opakuje.
Kód, který se má vykonávat, dokud platí podmínka, může vypadat třeba takto:

```ts
import { createRobutek } from "./libs/robutek.js";
import * as gpio from "gpio";

const robutek = createRobutek("V2");

console.log("START");
gpio.pinMode(robutek.Pins.ButtonLeft, gpio.PinMode.INPUT);

while (gpio.read(robutek.Pins.ButtonLeft) == 1) {
  // cyklus kontroluje, zdali je tlačítko zmáčknuté (gpio.read() vrací 1, pokud
  // je tlačítko zmáčknuté), dokud není zmáčknuté, vypisuje "NOT PRESSED"
  console.log("NOT PRESSED");
  // await sleep() čeká 100ms před dalším průchodem cyklu,
  // bez něj by se příliš rychle vypisovalo "NOT PRESSED"
  // (ve skutečnosti ne, Jaculus by takový program automaticky ukončil)
  await sleep(100);
}
console.log("END");
```

## Zadání B

Nyní napíšeme program, který do konzole vypíše čtverec složený z hvězdiček (znaku `*`). Musíme si uvědomit, že cykly mohou být vloženy do sebe. Zamyseleme se, který z cyklů je pro tento úkol vhodný. Výsledek by měl vypadat přibližně takto.

```
***
***
***
```

Velikost tohoto čtverce určete pomocí konstanty, jejíž hodnota udává počet řádku a sloupců.

Pokud nechceme za vypsanými znaky nový řádek, místo známého `#!ts console.log()` použijeme `#!ts stdout.write` ale potřebujeme importovat novou knihovnu: 
```ts
import { stdout } from "stdio";
```

??? note "Řešení"

    ```ts
    import { stdout } from "stdio";

    const SQUARE_SIZE: number = 3; // velikost čtverce

    console.log("Vykreslíme čtverec o velikosti " + SQUARE_SIZE + "x" + SQUARE_SIZE);

    // projdeme všechny řádky
    for(let row: number = 0; row < SQUARE_SIZE; row++){
    	// projdeme všechny sloupce
    	for(let col: number = 0; col < SQUARE_SIZE; col++){
    		stdout.write("\*"); // vypíšeme hvězdičku
    	}
    	stdout.write("\n"); // přesuneme se na další řádek
    }
    ```

## Zadání výstupního úkolu V1

Napište program, který který vypíše čísla od 9 do 0.
Zadání je velmi podobné jako zadání A, jen jdou čísla sestupně namísto vzestupně. Nekopírujte jen dodaný kód, ale zkuste si jej napsat sami.

## Zadání výstupního úkolu V2

Napište program, který bude periodicky blikat ledkou - 500ms svítí, 500ms nesvití. Nepoužívejte `setInterval`.

## Zadání výstupního úkolu V3

Váš poslední úkol je podobný zadání B, budete do konzole vykreslovat geometrický obrazec, akorát tentokrát to bude nebude čtverec, ale trojúhelník jako tenhle:

```
  *
 ***
*****
```

Je důležité se zamyslet nad počty mezer a hvězdiček v každém řádku a jak se mění. Zkuste si jejich počty vypsat řádek po řádku, navede vás to k řešení příkladu.

# Lekce 6 - cykly

V této lekci si představíme cykly, což je nástroj který nám umožňuje opakovat kód podle nějakého pravidla.
Zatím je využijeme pro komunikaci s robotem, v následující lekci si ukážeme jejich použití při řízení robota.

Máme primárně dva typy cyklů:

- `#!ts for` pro případ kdy víme kolikrát se cyklus má opakovat
- `#!ts while` pro případ kdy neznáme počet opakování

### Cyklus for
Cyklus `#!ts for`  můžeme napsat takto:
```ts
for(let i: number = 0; i < 3; i++) {
  // opakovaný kód
}
```
Do kulatých závorek píšeme tři věci:

- řídící proměnnou s její výchozí hodnotou
- výraz který určuje počet opakování
- nakonec jednoduchou operaci která se provede při každém průchodu cyklem jako poslední operace

Tedy vytváříme proměnnou `#!ts i` s výchozí hodnotou `#!ts 0`, která bude existovat po dobu toho, co se vykonává cyklus.
Ačkoliv v běžném životě počítáme věci od `1`, v informatice častěji začínáme `0`. Může zde však být cokoliv.

Následně definujeme výraz `#!ts i < 3 `, který značí, kdy se cyklus má zastavit. Na konci cyklu zvýšíme `#!ts i ` o jedna.
Při prvním průchodu bude tedy `#!ts i = 0` při druhém `#!ts i = 1 ` a při třetím `#!ts i = 2 ` při dalším zvyšování by platilo `#!ts i = 3 ` tam ale už nebude pravdivý výraz ` i < 3 ` a cyklus se tedy ukončí.
Do složených závorek píšeme vykonávaný kód, který se v tomto případě vykoná 3-krát.


## Zadání A
Ve spojení se znalostmi z minulých lekcí napište program, který po stisku tlačítka vypíše čísla 0 až 9 (pomocí `#!ts console.log(cislo)`), vždy na samostatný řádek.
Kod napište tak aby bylo jednoduché ho upravit na výpis jakéhokoli jiného intervalu, např. 0 až 99 nebo 10 až 19.

??? note "Řešení"
    ```ts
	import * as gpio from "gpio";

    const BTN_PIN = 0;

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

Do kulatých závorek teď píšeme jen výraz který určuje jestli se cyklus vykoná znovu nebo ne.
Kód, který se má vykonávat, dokud platí podmínka, vypadá takto:
```ts
while (podmínka) {
	// náš kód
}
```



## Zadání B
Nyní napište kód který do konzole vypíše čtverec složený z hvězdiček (znaku `*`),
např. takto:
```
***
***
***
```
Velikost tohoto čtverce určete pomocí konstanty jejíž hodnota udává počet řádku a sloupců.

Pokud nechceme za vypsanými znaky nový řádek, místo známého `#!ts console.log()` použijeme `#!ts stdout.write`

??? note "Řešení"
	```ts
	import { stdout } from "stdio";

	const SQUARE_SIZE: number = 3; // velikost čtverce

	console.log("Vykreslíme čtverec o velikosti " + SQUARE_SIZE + "x" + SQUARE_SIZE);

	for(let row: number = 0; row < SQUARE_SIZE; row++){ // projdeme všechny řádky
		for(let col: number = 0; col < SQUARE_SIZE; col++){ // projdeme všechny sloupce
			stdout.write("*"); // vypíšeme hvězdičku
		}
		stdout.write("\n"); // přesuneme se na další řádek
	}
	```


## Zadání výstupního úkolu V1
Napište kod který který vypíše čísla od 9 do 0.
Zadání je velmi podobné jako zadání A, jen jdou čísla sestupně namísto vzestupně. Nekopírujte jen dodaný kód, ale zkuste si jej napsat sami.

## Zadání výstupního úkolu V2
Stejně jako v zadání B budeme do konzole vykreslovat geometrický obrazec, akorát tentokrát to bude trojúhelník jako tenhle:

```
*
**
***
****
*****
```

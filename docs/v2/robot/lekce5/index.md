# Lekce 5 - funkce

## Funkce - Co to je?
Funkce je část programu, kterou můžeme volat (spouštět) jinými částmi programu.
Rozdělení programu na funkce ho výrazně zpřehledňuje a umožňuje nám opakovaně používat jeden kus kódu.

## Vytvoření a zavolání funkce
```ts
function sayHello(): void {
    console.log("Ahoj");
    console.log("z funkce");
}
```

Funkci zavoláme následujícím způsobem:
```ts
sayHello();
```

??? info "Kód nám vypíše:"
    ```bash
    info:    Device: Starting machine
    Ahoj
    z funkce
    ```

## Předávání argumentů
Funkcím můžeme při volání předávat argumenty. Argumenty funkce píšeme při vytváření funkce do závorky.
Pokud je argumentů více, oddělujeme je čárkou. Parametry je taky potřeba vhodně otypovat.
```ts
function getSquare(num: number): void {
    let square: number = num * num;
    console.log("Druhá mocnina zadaného čísla je:");
    console.log(square);
}
```

Funckci zavoláme následujícím způsobem:
```ts
getSquare(5);
```

??? info "To by nám mělo vypsat:"
    ```bash
    info:    Device: Starting machine
    Druhá mocnina zadaného čísla je:
    25
    ```

## Vracení hodnot
Z funkce je možné vrátit hodnotu. Můžeme tak jednoduchým způsobem pojmenovat složitější výpočty a provádět je opakovaně.
Hodnoty vracíme pomocí klíčového slova `#!ts return`. Podobně jako v případě parametrů musíme specifikovat **typ** vracené hodnoty.
Pokud funkce žádnou hodnotu nevrací, návratový typ je `#!ts void`, tedy "prázdná hodnota".

```ts
function getAverage(num1: number, num2: number): number {
    let sum: number = num1 + num2; // Součet dvou čísel
    return sum / 2; // Vrátíme průměr dvou čísel jako návratovou hodnotu
}
```

Funkci použijeme následujícím způsobem:
```ts
let average: number = getAverage(5, 10);

console.log("Průměr je:");
console.log(average);
```

??? info "Výstup programu"
    ```bash
    info:    Device: Starting machine
    Průměr je:
    7.5
    ```


??? warning "Nedosažitelný kód"
    Použitím klíčového slova `#!ts return` ukončíme vykonávání současné funkce a vrátíme se zpátky do funkce která ji zavolala.
    Z toho vyplývá, že to co napíšeme za `#!ts return` se již nikdy nevykoná.
    ```ts
    function getSquare(num: number): number { // Druhá mocnina
        return num * num;
        console.log("Toto se nikdy nevypíše");
    }
    ```

<!-- ## Asynchronní funkce
Když zavoláme běžnou funkci, tato funkce se vykoná a program potom pokračuje dál.
V následujícím programu se nejdřív vykoná ```timeConsumingFunc``` a až poté co dokončí svoji práci se zavolá funkce ```somethingElse```.
```ts

    function timeConsumingFunc() {
        // Neco velmi casove narocneho zde
    }

    timeConsumingFunc();
    somethingElse();
```


??? tip "Co znamená asynchronní vykonávání funkce? "
    Když zavoláme asynchronní funkci, řízení se nepředá výhradně volané funkci, ale asynchronní zavolaná funkce a původní funkce se začnou střídat v řízení. -->

Samozřejmě můžeme funkce kombinovat, vzájemně volat z jiných funkcí, a výsledky ukládat do proměnných. 
Můžeme tak kombinovat funkcionalitu dříve napsaných funkcí a zpřehlednit celkový kód.

```ts
function getSquare(num: number): number { // Druhá mocnina
    return num * num;
}

function sumSquares(first: number, second: number) { // Sečti druhé mocniny
    let result = getSquare(first) + getSquare(second);
    return result;
}
```

## Zadání A

Podíváme se opět na příklady z předchozích lekcí, a zobecníme části kódu tak, aby šly jednoduše měnit.
V prvním příkladu vytvoříme funkci `#!ts count`, která jako argumenty vezme dvě čísla, a postupně vypíše čísla od prvního argumentu, po druhý.
tedy zavolání funkce `#!ts count(1, 5)` vypíše

```bash
1
2
3
4
5
```

??? note "Řešení"
    ```ts
    function count(lower: number, upper: number): void {
        for (let counter = lower; counter <= upper; counter++) {
            console.log(counter);
        }
    }
    ```

## Zadání B

Místo vypisování čtverečku si chceme napsat funkci, která na výstup nakreslí obdélník libovolné velikosti.
Napíšeme tedy funkci `#!ts drawRectangle` (nakresli obdélník), která vezme argument šířky a délky, a poté vypíše obdélník dané velikosti.
??? note "Řešení"
    ```ts
    import { stdout } from "stdio";

    function drawRectangle(cols: number, rows: number): void { // funkce, která vykreslí obdélník (počet sloupců, počet řádků)
        for (let row: number = 0; row < rows; row++) { // projdeme všechny řádky
            for (let col: number = 0; col < cols; col++) { // projdeme všechny sloupce
                stdout.write("*"); // vypíšeme hvězdičku
            }
            stdout.write("\n"); // přesuneme se na další řádek
        }
    }

    drawRectangle(5, 2); // vypíše obdélník o velikosti šířky 5 a délky 2
    ```

## Zadání C

Nakonec se vrátíme k LED páskům, které teď můžeme rozsvítit jednou funkcí vybraným způsobem.
Napíšeme funkci, která na vstupu vezme barvu a číslo LED, kterou chceme rozsvítit.

??? note "Řešení"
    ```ts
    import { SmartLed, LED_WS2812 } from "smartled";
    import * as colors from "./libs/colors.js"

    const LED_PIN = 21;
    const LED_COUNT = 8;

    const ledStrip = new SmartLed(LED_PIN, LED_COUNT, LED_WS2812);  // připojí pásek na pin 21, s 8 ledkami a typem WS2812

    function setLed(color: colors.Rgb, index: number){
        ledStrip.set(index, color); // Nastavíme LED na aktuální odstín
        ledStrip.show(); // Zobrazíme vybranou barvu
    }
    ```

## Zadání výstupního úkolu V1

Zkombinujeme to, co jsme se zatím naučili:
vytvoříme funkci, která na vstupu dostane barvu, číslo počáteční a koncové LED, a zabarví všechny LED v tomto rozsahu.
Ostatní LED zhasne.

!!! tip "Pro dobrovolníky"

    - Můžeme vybrané LEDky rozsvítit různými barvami: např. funkcí `#!ts colors.rainbow()` procházet definovaný rozsah barev

    - Místo jedné barvy můžeme zadat počáteční a koncovou barvu, přičemž LED mezi nimi budou mezi těmito dvěma barvami postupně přecházet.

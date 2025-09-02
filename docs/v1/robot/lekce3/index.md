# Lekce 3 - proměnné a podmínky

V imperativním programování si držíme stav pomocí **proměnných**. Proměnné jsou pojmenované hodnoty,
které můžeme měnit, a opakovaně používat v různých částech kódu.

Proměnná má svůj typ, který určuje, jaké hodnoty může proměnná mít. Proměnnou vytvoříme pomocí
klíčového slova `let`.
Každý jazyk má několik základních typů, zatím nám budou stačit dva:

- **number**: základní číselný typ, může nabývat např. hodnot: `1`, `2`, `10`, `-5`, `0.5`
- **boolean**: základní pravdivostní typ, který nabývá hodnot `true` a `false`

Hodnoty přiřazujeme do proměnných pomocí operátoru `=`. Příklad použití:

```ts
let first : number; // Vytvoří proměnnou se jménem first, a typem number
first = 10; // Přiřadí do proměnné hodnotu 10
first = 15; // Změní hodnotu proměnné na 15
let second : number = 20; // Vytváření a přiřazení můžeme zkombinovat
let truth : boolean = true; // Vytvoří proměnnou typu bool, která reprezentuje pravdu
```

S proměnnými stejně jako s čísly můžeme provádět základní operace.

```ts
let a : number = 10;
let b : number = 5;
let c : number = a + b;
let d : number = b - a;
```

Abychom na základě hodnot proměnných mohli měnit chování programu, potřebujeme **podmínky**.

Podmínka `if` na základě pravdivostní hodnoty rozhodne, zda se vykoná daný kus kódu. Pokud proměnná
`podmínka` je typu bool, potom po vykonání následujícího kódu:
```ts
let result : number = 10;
if (podmínka) {
  result = 20;
}
```

Pokud `podmínka` má hodnotu `true`, bude v `result` 20, pokud má `podmínka` hodnotu `false`, bude v `result` 10.

Rovněž se můžeme v podmínce rozhodovat na základě porovnávání číselných hodnot.

```ts
let first : number;
let second : number;
...
if (first == second) {
  ...
}
```

To, zda jsou dvě čísla stejná, zjistíme pomocí `==`, zda je jedno větší než druhé zjišťujeme pomocí `<` a `>`, případně `<=` a `>=` pokud chceme připustit rovnost.

Pokud se chceme zachovat dvěma různými způsoby, použijeme konstrukci

```ts
if (podmínka) {
  a
} else {
  b
}
```

Pokud podmínka platí, vykoná se kód `a`, pokud neplatí, vykoná se kód `b`.

Za použití proměnných a podmínek rozsvítíme světlo na naší desce různými barvami.

Barevné světlo vytváříme ze tří základních barev: červená (RED), zelená (GREEN), a modrá (BLUE).
Tyto barvy mícháme v různých poměrech od 0 do 255, a vytváříme tak různé barvy:

- První hodnota (r) nám dává množství červené (tedy např. hodnoty 100, 0, 0) rozsvítí LEDku červeně
- Druhá (g) dává množství zelené
- Třetí (b) dává množství modré

Ve výchozím stavu je LED vypnutá (hodnoty `(0, 0, 0)`), a nejsilnější bílé světlo získáme použitím všech
barev na maximum (hodnoty `(255, 255, 255)`).

Druhou variantou je použití předdefinovaných barev, které jsou v souboru `colors.ts`. Příklad použití obou variant:

  ```ts
  ledStrip.set(0, colors.off); // Vypne LEDku pomocí předdefinované barvy
  ledStrip.set(0, {r: 0, g: 0, b: 0}); // Vypne LEDku pomocí vlastní barvy

  ledStrip.set(0, colors.green); // Rozsvítí LEDku zeleně pomocí předdefinované barvy
  ledStrip.set(0, {r: 0, g: 255, b: 0}); // Rozsvítí LEDku zeleně pomocí vlastní barvy
  ```

Pro tuto lekci si stáhneme [zip](./project3.zip), nebo navážeme na předchozí cvičení. Své řešení budeme psát do souboru `index.ts`.

## Zadání A

Pomocí jedné proměnné se stavem a podmínky každou sekundu buď rozsvítíme, nebo zhasneme LED na desce.

??? note "Řešení"
    ```ts
    import { LED_WS2812, SmartLed } from "smartled"
    import * as colors from "./libs/colors.js";
    import { createRobutek } from "./libs/robutek.js"
    const robutek = createRobutek("V1");

    const ledStrip = new SmartLed(robutek.Pins.ILED, 1, LED_WS2812);

    let on: boolean = false; // LED je vypnutá

    setInterval(() => {
      if (on) { // Pokud je LED zapnutá
        ledStrip.set(0, colors.off); // Vypneme LED
        ledStrip.show(); // Zobrazíme změny
        on = false;
      } else {
        ledStrip.set(0, colors.green); // Rozsvítíme LED zelenou barvou
        ledStrip.show(); // Zobrazíme změny
        on = true
      }
    }, 1000);
    ```

## Zadání B

Pomocí funkce `colors.rainbow` budeme procházet duhu. Jde o funkci (o těch si povíme trochu více později), která dostane číslo od 0 do 360,
a na základě toho vrátí barvu na barevném spektru. V daném intervalu (např. 100 ms) budeme postupně zvyšovat číslo a nastavovat barvu LEDky na `colors.rainbow(cislo)`. Pokud naše číslo přesáhne hodnotu `360`, musíme ho
opět nastavit na `0`.

??? note "Řešení"
    ```ts
    import * as colors from "./libs/colors.js";
    import { LED_WS2812, SmartLed } from "smartled";
    import { createRobutek } from "./libs/robutek.js"
    const robutek = createRobutek("V1");

    const ledStrip = new SmartLed(robutek.Pins.ILED, 1, LED_WS2812);

    let shade = 0; // Držíme si stav s aktuálním odstínem

    setInterval(() => {
        ledStrip.set(0, colors.rainbow(shade)); // Nastavíme LED na aktuální odstín
        ledStrip.show(); // Zobrazíme vybranou barvu
        shade = shade + 1; // Zvedneme odstín (lze i shade += 1)
        if (shade > 360) {
            shade = 0;
        }
    }, 100);
    ```

## Zadání C

Tentokrát budeme reagovat na stisk tlačítka.
Do desky si zapojíme pásek 8 inteligentních ledek, a vybranou barvou je budeme rozsvěcet.

Po stisku tlačítka zhasneme aktuální LEDku, a rozsvítíme tu další.
Pokud při stisku tlačítka svítí poslední LED, zhasneme ji, a rozsvítíme opět první LED.

!!! note "Led pásek je připojený za inteligentní ledku na desce, takže index pásku začíná na 1."

??? note "Řešení"
    ```ts
    import * as colors from "./libs/colors.js";
    import { LED_WS2812, SmartLed } from "smartled";
    import { createRobutek } from "./libs/robutek.js"
    const robutek = createRobutek("V1");

    import * as gpio from "gpio";

    const ledStrip = new SmartLed(robutek.Pins.ILED, 9, LED_WS2812);

    gpio.pinMode(robutek.Pins.ButtonRight, gpio.PinMode.INPUT); // Nastavíme tlačítko

    let index : number = 1;
    let color : Rgb = colors.light_blue; // Vybereme si barvu
    ledStrip.set(0, color); // Nastavíme LED na aktuální odstín
    ledStrip.show(); // Zobrazíme změny

    gpio.on("falling", robutek.Pins.ButtonRight, () => {
        ledStrip.set(index, colors.off); // Vypneme předchozí LED
        index = index + 1; // Zvedneme index (lze i index += 1)
        if(index > 8){ // Pokud jsme mimo rozsah pásku, vrátíme se na začátek
            index = 1;
        }
        ledStrip.set(index, color); // Nastavíme aktuální LED
        ledStrip.show();  // Zobrazíme změny
    });
    ```

## Výstupní úkol V1 - Knightrider

Svítící LED "běhá" s danou rychlostí od začátku do konce pásky.
Jakmile dorazí na konec, změní směr, a posouvá se opačným směrem.

V našem případě bude stačit, když se bude pohybovat pouze jedna LEDka.

![Knightrider](./assets/knight-rider.gif)

!!! tip "Pro dobrovolníky"

    - Jezdec může při běhu měnit barvy (např. pomocí funkce `rainbow`)

    - Jezdec může zanechávat stopu: barva nezmizí hned, ale až s odstupem. Barva může "mizet" postupně: intenzita stopy se časem snižuje.

# Lekce 8 - Řetězce

Zatím jsme se zařízením po nahrání programu komunikovali jednostranně: pomocí `#!ts console.log()` jsme vypisovali různé věci na výstup, a ten jsme sledovali pomocí příkazu `Monitor`.

Na to, abychom za běhu mohli posílat informace do zařízení, potřebujeme nový datový typ: řetězce.

Řetězce jsou sekvence znaků, a umožňují nám předávat informace.
Datový typ, který drží řetězec, se jmenuje `#!ts string`.

- Řetězec je vždy uzavřený do uvozovek `#!ts ""`, `''` nebo <code>``</code>
    ```ts
    let str : string = "ahoj";  // vytvoří řetězec
    ```
- Řetězce můžeme spojovat pomocí `#!ts +`
    ```ts
    let str : string = "ahoj" + " " + "jak se máš?";  // vytvoří řetězec "ahoj jak se máš?"

    let answer : string = "dobře";

    let str2 : string = "ahoj " + answer;  // ahoj dobře
    ```
- Speciálním případem jsou formátovací řetězce, kam se dosadí hodnota proměnné
    ```ts
    //! pozor jiné uvozovky
    let str3 : string = `ahoj ${answer}`;  // ahoj dobře
    ```
- Když spojíme řetězec s číslem, číslo se automaticky převede na řetězec a spojí se stejným způsobem
    ```ts
    let str4 : string = answer + " " + 5;  // dobře 5

    let num : number = 5;
    let str5 : string = "Je mi " + number + " let";
    ```

??? warning "Automatický převod na řetězec"
    Sčítání řetězců a čísel nefunguje ve všech jazycích, jde o chování specifické pro TypeScript(JavaScript) a pár podobných jazyků.
    Nenechte se zaskočit tím, jak se to chová:
    ```ts
    let result : string = "5 + 1 je: " + 5 + 1;
    ```
    V `result` bude `"5 + 1 je: 51"`!
    
    5 se přidá do řetězce, a poté se tam přidá 1, nesečtou se předem.


Stejně jako ostatní typy je můžeme předávat do funkcí a vracet:
```ts
function greetName(name: string) : void {
    console.log("Ahoj " + name);
}
```

Na dnešní cvičení si opět můžeme stáhnout [zip](./project8.zip). 

## Zadání A

Nejdříve se vrátíme k funkci `console.log()`, díky které jsme vypisovali různé hodnoty.
Tato funkce bere jako argument řetězec; pokud argument není řetězec, předem definovaným způsobem se na řetězec automaticky převede.

Jako první úkol si vyzkoušíme spojit řetězec a číslo s tím, co už známe:

Napíšeme program, který při stisku tlačítka vypíše na výstup `"Potenciometr naměřil X."`, kde X je aktuální hodnota naměřená z `POT0`.

??? note "Řešení"
    ```ts
    import * as gpio from "gpio";
    import * as adc from "adc";


    const BTN_LEFT = 18;

    const POT0_PIN = 2;

    gpio.pinMode(BTN_LEFT, gpio.PinMode.INPUT);

    adc.configure(POT0_PIN);

    gpio.on("falling", BTN_LEFT, () => {
        console.log("Potenciometr naměřil " + adc.read(POT0_PIN) + ".");
    });
    ```

### Čtení ze vstupu

Aby komunikace se zařízením nebyla pouze jednostranná, a my mohli z počítače posílat nové příkazy za běhu, použijeme přiložený program `readline`. Podobně jako v případu LED pásku musíme vytvořit hodnotu typu readline pomocí `#!ts const reader = new readline(false)`.

Jakmile máme vytvořený objekt typu readline, pomocí `await reader.read()` počkáme na vstup. Jelikož jde o speciální funkci, můžeme ji volat pouze z nové funkce, která je označena jako `async function`.

??? info "Ukázka práce s řetězcem s readline"
    ```ts
    import { stdout } from "stdio";
    import { readline } from "./libs/readline.js";

    //* řetězce
    async function echo() {
        stdout.write("Napiš nějaký text a stiskni enter.\n");
        const reader = new readline(false);  // vytvoří novou instanci třídy readline
        while (true) {  // opakuje se donekonečna
            const line = await reader.read();  // přečte řádek z konzole
            stdout.write("Zadal jsi: " + line + "\n");  // vypíše řádek na konzoli
            stdout.write(`Druhá možnost výpisu: Zadal jsi: ${line}\n`);  // vypíše řádek na konzoli

            if (line == "konec") {  // pokud je řádek roven "konec"
                stdout.write("Ukončuji.\n");  // vypíše text na konzoli
                break;  // ukončí cyklus
            }
        }
        reader.close();  // ukončí čtení z konzole
    }

    echo();  // zavolá funkci echo
    ```

??? info "Pro zájemce: Async a await"
    Funkce, které známe doteď, vykonávaly všechny příkazy hned, v pořadí tak, jak jsou po sobě napsané. Funkce, které čekají na nějaký vstup od uživatele, označujeme jako asynchronní (async). Funkce `reader.read()` po spuštění čeká na textový vstup od uživatele, a mezitím se můžou vykonávat ostatní události. Když před funkci dáme `await`, značíme tak, že čekáme na výsledek, a další řádek kódu se vykoná až když na vstup přijde řetězec zakončený novým řádkem.

## Zadání B

Napíšeme program, který se zeptá, jak se jmenujeme, a počká na odpověď. Až program dostane odpověď, vypíše na konzoli `#!ts Jmenuješ se "` a jméno, které jsme mu zadali.

??? note "Řešení"
    ```ts
    import { readline } from "./libs/readline.js"

    async function askName(){
        console.log("Jak se jmenuješ?");
        const reader = new readline(false);
        let name : string = await reader.read();
        console.log("Jmenuješ se " + name);
    }

    askName();
    ```

### Standardní funkce

Každý jazyk nabízí řadu funkcí na práci se řetězci. Můžeme je například převádět na čísla, obracet, měnit znaky, a podobně. Pro nás je zajímavé umět načíst ze vstupu číslo: to můžeme udělat tak, že pomocí funkce `read()` dostaneme řetězec ze vstupu, a poté na něm zavoláme funkci `parseInt()`, která nám ho převede na celočíselnou hodnotu.

```ts
let str : string = "20"; // Řetězec se znaky pro 20
let num : number = parseInt(str); // Převedeme řetězec na číslo, a můžeme s ním počítat
let doubled : number = num * 2; // doubled bude mít hodnotu 40
```

## Výchozí úloha V1

Napište (asynchronní) funkci, která počká na vstup od uživatele, převede ho na číslo, a poté rozsvítí LEDku na desce pomocí `colors.rainbow()` s hodnotou načteného čísla.

!!! tip "Pro dobrovolníky"
    Uživatel velice jednoduše narozdíl od počítače může udělat chybu, a napsat číslo, které nepatří do rozsahu pro tuto funkci. Pomocí while cyklu můžeme opakovat dotaz na vstup, dokud uživatel nezadá správnou hodnotu, tedy takovou, která je větší než `0` a menší než `360`.
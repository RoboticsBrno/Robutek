# Lekce 7 - pole

Pole neboli `#!ts array` slouží k uložení více hodnot stejného typu.
Hodnoty jsou uloženy za sebou, můžeme je do pole přidávat, odebírat, a přistupovat podle indexu.

- Pole vytvoříme pomocí hranatých závorek
    ```ts
    let arr : number[] = [1, 2, 3, 4, 5];  // vytvoří pole
    ```
- K jednotlivým prvkům se dostaneme pomocí indexu (pořadí v poli) v hranatých závorkách
    - Indexování začíná od 0: první prvek je na indexu 0
        ```ts
        let arr : number[] = [1, 2, 3, 4, 5];  // vytvoří pole
        let num : number = arr[0];  // do proměnné num uložíme hodnotu na indexu 0 (tedy 1.)
        ```
    - Můžeme přistupovat na libovolné místo v poli:
        ```ts
        let arr : number[] = [1, 2, 3, 4, 5];  // vytvoří pole
        let num : number = arr[2];  // do proměnné num uložíme hodnotu na indexu 2 (tedy 3.)
        ```
    - Index můžeme použít i pro změnu hodnoty
        ```ts
        let arr : number[] = [1, 2, 3, 4, 5];  // vytvoří pole
        arr[2] = 10;  // změní hodnotu na indexu 2 z 3 na 10: výsledné pole bude [1, 2, 10, 4, 5]
        ```
- Délku pole zjistíme pomocí funkce
    ```ts
    let arr : number[] = [1, 2, 3, 4, 5];  // vytvoří pole
    let length : number = arr.length; // hodnota length bude 5
    ```
- Hodnotu na konec pole přidáme pomocí funkce `push`
    ```ts
    let arr : number[] = [1, 2, 3, 4, 5];  // vytvoří pole
    arr.push(6);  // přidá hodnotu na konec: výsledné pole bude [1, 2, 3, 4, 5, 6]
    ```

- Hodnotu z konce pole odebereme pomocí funce `pop`
    ```ts
    let arr : number[] = [1, 2, 3, 4, 5];  // vytvoří pole
    let num : number = arr.pop();  // odebere hodnotu z konce: výsledné pole bude [1, 2, 3, 4]
    ```

K řešení budeme potřebovat [stejné nástroje](../lekce6/project6.zip) jako v předchozí lekci.
Složku si můžete rozbalit jako project7.

## Zadání A

Opět navážeme na předchozí lekce, a budeme do pole ukládat hodnoty ze sensoru.
Vytvoříme si pole, které při stisku vybraného tlačítka přidá aktuální hodnotu z ADC převodníku.
Druhé tlačítko z tohoto pole poslední hodnotu smaže.
Stav pole si můžeme po každé změně vypsat pomocí `#!ts console.log(pole)`.

??? note "Řešení"
    ```ts
    import * as adc from "adc";
    import * as gpio from "gpio";

    const SENSOR_PIN: number  = 4; // pin levého předního senzoru u kola z pohledu zvrchu
    const LIGHTN_PIN: number  = 47; // pin na zapnutí podsvícení pro senzory

    const LBTN_PIN : number = 2; // pin levého tlačítka
    const RBTN_PIN : number = 0; // pin pravého tlačítka

    gpio.pinMode(LBTN_PIN, gpio.PinMode.INPUT); // nastavíme levé tlačítko
    gpio.pinMode(RBTN_PIN, gpio.PinMode.INPUT); // nastavíme pravé tlačítko

    adc.configure(SENSOR_PIN); // nakonfigurujeme pin senzoru

    gpio.pinMode(LIGHTN_PIN, gpio.PinMode.OUTPUT); // nastavíme mód pinu podsvícení na output
    gpio.write(LIGHTN_PIN, 1); // zapneme podsvícení robůtka

    let arr : number[] = [];

    gpio.on("falling", LBTN_PIN, () => { // Při stisknutí levého tlačítka
        arr.push(adc.read(SENSOR_PIN)); // Přidáme do pole naměřenou hodnotu
        console.log(arr); // Vypíšeme nový stav
    });
    gpio.on("falling", RBTN_PIN, () => { // Při stisknutí pravého tlačítka
        arr.pop(); // Odebereme z pole poslední hodnotu
        console.log(arr); // Vypíšeme nový stav
    });
    ```

## Výchozí úkol V1

Tentokrát si vytvoříme o něco rozsáhlejší program, který naváže na předchozí úkol.
Vytvoříme si pole čísel, do kterého pomocí prvního tlačítka načteme naměřené hodnoty z ADC převodníku.
Při stisku prvního tlačítka kontrolujeme, jestli už pole má délku 8.
Pokud už je délka 8, další hodnoty nepřidáváme a stisk tlačítka pole nezmění.

Druhé tlačítko smaže poslední prvek -- zde kontrolujeme, jestli tam nějaký prvek je.

Při každé změně hodnot v poli se rozsvítí LED pásek podle naměřených hodnot.
Všechny hodnoty v poli převedeme na rozsah `colors.rainbow` (tedy 0-360) a rozsvítíme LED
na odpovídajícím indexu naměřenou hodnotou.
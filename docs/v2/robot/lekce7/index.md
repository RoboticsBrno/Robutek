# Lekce 7 - Funkce

Z předchozích lekcí už umíme kreslit jednoduché tvary. Co když jich však chceme nakreslit více?

Pokud chceme nakreslit 2 čtverce vedle sebe, můžeme zkopírovat kód a mezitím se posunout:

```ts
import { createRobutek } from "./libs/robutek.js";
import { Servo } from "./libs/servo.js";

const robutek = createRobutek("V2");

const pen = new Servo(robutek.Pins.Servo2, 1, 4);
robutek.setSpeed(100);

pen.write(robutek.PenPos.Down); // dáme dolů tužku

// chování opakujeme 4x, pro každou stěnu čtverce
for (let i: number = 0; i < 4; i++) {
    await robutek.move(0, { distance: 100 }); // posun dopředu o 10 cm
    await robutek.rotate(90); // rotace doprava o 90 stupňů
}
pen.write(robutek.PenPos.Up); // dáme nahoru

await robutek.move(0, { distance: 300 });

pen.write(robutek.PenPos.Down);
for (let i: number = 0; i < 4; i++) {
    await robutek.move(0, { distance: 100 });
    await robutek.rotate(90);
}
pen.write(robutek.PenPos.Up);
```

To se ještě dá zvládnout, ale pokud bychom to udělali ještě párkrát, kód by se stával hůře čitelným.
Pokud bychom se pak rozhodli změnit např. velikost nakreslených čtverců, museli bychom to měnit v každé kopii tohoto kódu, což zabere čas, a je v tom jednoduché udělat chybu.

Můžeme si pomoct tím, co už známe: vnořeným `for` cyklem. Pokud chceme nakreslit např. 4 čtverce za sebou, můžeme to napsat takto:

```ts
import { createRobutek } from "./libs/robutek.js";
import { Servo } from "./libs/servo.js";

const robutek = createRobutek("V2");

const pen = new Servo(robutek.Pins.Servo2, 1, 4);
robutek.setSpeed(100);

for (let square: number = 0; square < 4; square++) {
    pen.write(robutek.PenPos.Down);
    for (let i: number = 0; i < 4; i++) {
        await robutek.move(0, { distance: 100 });
        await robutek.rotate(90);
    }

    pen.write(robutek.PenPos.Up);
    await robutek.move(0, { distance: 150 });
}
```

Co když se však chceme pohybovat mezi čtverci různě daleko, nebo mít každý jinak velký? Odpovědí na tuto otázku jsou **funkce**.

## Funkce

Funkce je pojmenovaný kus kódu. Tento kus kódu jednou napíšeme a poté ho ze zbytku programu můžeme libovolně volat (spouštět). Celkově tak zpřehledňuje programy a dělá je rozšířitelnější.

V programu rozlišujeme mezi definicí funkce a jejím voláním. Definice vypadá následovně:

```ts
import { Servo } from "./libs/servo.js";
import { createRobutek } from "./libs/robutek.js";
const robutek = createRobutek("V2");

const pen = new Servo(robutek.Pins.Servo2, 1, 4);
robutek.setSpeed(100);

async function draw_square(): Promise<void> {
    pen.write(robutek.PenPos.Down);
    for (let i: number = 0; i < 4; i++) {
        await robutek.move(0, { distance: 100 });
        await robutek.rotate(90);
    }
    pen.write(robutek.PenPos.Up);
}
```

Definice funkce se skládá z:

- klíčového slova `function`
- jména funkce
- seznamu argumentů `(ARGUMENTS...)`
- návratového typu
- těla funkce (ve složených závorkách)

<!-- TODO toto neni asi uplne pravda, treba rozhodnout jestli to je akceptovatelna lez -->

Protože v těle funkce používáme klíčové slovo `await`, je potřeba aby funkce byla označena jako `async`. Znamená to, že je tzv. asynchronní a během konání se mohou plnit další úkoly. Návratový typ asynchroních funkcí musí být obalen do `Promis<RETURN_TYPE>`, kde `RETURN_TYPE` je typ, který chceme, aby funkce vracela. Datový typ `void` říká programu, že funkce nemá nic vracet.

Klíčové slovo `await` říká programu, že má počkat na vykonání dané funkce.

K argumentům a návratovým hodnotám se dostaneme později, zatím je pro nás zajímavé jednoduše to, že jsme si nějak pojmenovali kus kódu.

Když spustíme tento kód, nic se nestane. Chybí nám totiž funkci **zavolat**. Volání funkce provedeme jejím jménem, následovaným závorkami. Pokud je funkce asynchronní a chceme čekat na její vykonání, než začneme provádět další úkol, před její volání dáme klíčové slovo `await`.

Nakreslení dvou čtverců může tedy vypadat takto:

```ts
import { Servo } from "./libs/servo.js";
import { createRobutek } from "./libs/robutek.js";

const robutek = createRobutek("V2");

const pen = new Servo(robutek.Pins.Servo2, 1, 4);
robutek.setSpeed(100);

async function draw_square(): Promise<void> {
    pen.write(robutek.PenPos.Down);
    for (let i: number = 0; i < 4; i++) {
        await robutek.move(0, { distance: 100 });
        await robutek.rotate(90);
    }
    pen.write(robutek.PenPos.Up);
}

await draw_square();
await robutek.move(0, { distance: 150 });
await draw_square();
```

Program nám nakreslí 2 čtverce, a přinesli jsme si tím následující výhody:

- ze sekvence "nakresli čtverec", "pohni se", "nakresli čtverec" je na první pohled zjevné, co se bude dít, a čtenář programu nemusí analyzovat detaily toho, jak přesně kreslení každého čtverce probíhá
- když se rozhodneme, že čtverce mají mít jinou velikost, stačí udělat změnu na jednom místě

!!! warning "Pozor na `async`"
Nezapomínejte při volání funkcí obsahujících pohyb na `async`
Pokud bychom v předchozím příkladu funkce volali bez `async`, příkazy by se mezi se mezi sebou "pobily" a robot by udělal ve výsledku nesmyslný pohyb.

Na tak malém příkladu to možná není zjevné, ale i `motors.move()`, které jsme používali doteď, není nic jiného než funkce, která v sobě skrývá nějaký složitější výpočet. Funkce tedy můžeme propojovat různými způsoby, a tvořit tak programy, které toho dělají čím dál více.

Program však neřeší případ, kdy chceme aby každý čtverec měl jinou velikost. V tu chvíli nám pomůžou **argumenty**, které do funkce umíme předat. Jde o proměnné, které existují v dané funkci, a my jim při volání funkce přiřadíme konkrétní hodnotu.

```ts
import { Servo } from "./libs/servo.js";
import { createRobutek } from "./libs/robutek.js";

const robutek = createRobutek("V2");

const pen = new Servo(robutek.Pins.Servo2, 1, 4);
robutek.setSpeed(100);

async function draw_square(size: number): Promise<void> {
    pen.write(robutek.PenPos.Down);
    for (let i: number = 0; i < 4; i++) {
        await robutek.move(0, { distance: size });
        await robutek.rotate(90);
    }
    pen.write(robutek.PenPos.Up);
}

await draw_square(100);
await robutek.move(0, { distance: 150 });
await draw_square(150);
```

Ve funkci používáme argument `size` značící velikost čtverce, který můžeme při volání nastavit na jakoukoliv hodnotu. Program tedy vykreslí jeden čtverec o délce strany 100mm, popojede, a vykreslí čtverec o délce strany 150mm.

## Zadání A

Vytvořte funkci, která bere 2 argumenty, a nakreslí obdélník daných rozměrů. Zkuste ji zavolat s rúznými argumenty.

??? note "Řešení"

    ```ts
    import { Servo } from "./libs/servo.js";
    import { createRobutek } from "./libs/robutek.js";

    const robutek = createRobutek("V2");

    let pen = new Servo(robutek.Pins.Servo2, 1, 4);
    robutek.setSpeed(100);

    async function draw_rectangle(sizeA: number, sizeB: number): Promise<void> {
        pen.write(robutek.PenPos.Down);
        for (let i: number = 0; i < 2; i++) {
            await robutek.move(0, { distance: sizeA });
            await robutek.rotate(90);
            await robutek.move(0, { distance: sizeB });
            await robutek.rotate(90);
        }
        pen.write(robutek.PenPos.Up);
    }

    await draw_rectangle(50, 200);
    await draw_rectangle(200, 50);
    ```

## Vracení hodnot

Kromě toho, že funkce můžou brát argumenty, tak je mohou i vracet. To je užitečné v případě, že si chceme do funkce dát nějaký výpočet, a zajímá nás jeho výsledek. Hodnotu z funkce vracíme pomocí klíčového slova `return`.

Tato funkce sečte paramatry `a` a `b` a vrátí výsledek výpočtu

```ts
function add(a: number, b: number): number {
    return a + b;
}

let cisloA = 5;
let cisloB = 9;

let vysledek = add(cisloA, cisloB);

console.log(vysledek); // vypíše 14
```

Příklad použití:

Chceme-li nakreslit pravidelný n-úhelník (vzorec pro vnitřní úhly je podle [wikipedie](https://cs.wikipedia.org/wiki/Pravideln%C3%BD_mnoho%C3%BAheln%C3%ADk))

$$(1 - \frac{2}{n}) * 180$$

kde `n` je počet stran n-úhelníku.

Tento výpočet nechceme psát několikrát, je proto vhodné jej vyčlenit do funkce, která vrací napočítanou hodnotu.

```ts
function polygonAngle(sides: number): number {
    return (1 - 2 / sides) * 180;
}

console.log(`čtverec: ${polygonAngle(4)}°`);
console.log(`šestiúhelník: ${polygonAngle(6)}°`);
console.log(`dvanáctiúhelník: ${polygonAngle(12)}°`);
```

## Zadání B

Napište funkci `drawPolygon()`, která vezme 2 argumenty: počet stran a délku každé strany. Na výpočet úhlu zatočení použijte pomocnou funkci, která spočítá, jak moc je potřeba zatočit. S drobnou úpravou můžete využít funkci `polygonAngle` z předchozího příkladu.

??? note "Řešení"

    ```ts
    import { Servo } from "./libs/servo.js";
    import { createRobutek } from "./libs/robutek.js";

    const robutek = createRobutek("V2");

    let pen = new Servo(robutek.Pins.Servo2, 1, 4);
    robutek.setSpeed(100);

    function turnAngle(sides: number): number {
    const polygonAngle = (1 - 2 / sides) * 180; // velikost úlhlu v n-úhelníku

    // odečteme od 180°, abychom dostali potřebný úhel otočení
    return 180 - polygonAngle;
    }

    async function drawPolygon(sides: number, size: number): Promise<void> {
    pen.write(robutek.PenPos.Down);
    for (let side: number = 0; side < sides; side++) {
        await robutek.move(0, { distance: size });
        await robutek.rotate(turnAngle(sides));
    }
    pen.write(robutek.PenPos.Up);
    }

    await drawPolygon(5, 100); // pětiúhelník
    await robutek.move(0, { distance: 250 });
    await drawPolygon(8, 100); // osmiúhelník
    ```

## Výstupní úkol V1

Napište program, který nakreslí jednoduchý domek se stromkem. Rozdělte kreslení mezi funkce `drawHouse()` s parametrem určujícím velikost domu a `drawTree()` s paramterem určujícím výšku stromu.

## Výstupní úkol V2

Vytvořte funkci, která nakreslí slunce s počtem paprsků daným paramterem.

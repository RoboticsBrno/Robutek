# Lekce 7 - funkce

Z minulé lekce už umíme kreslit jednoduché tvary. Co když jich však chceme nakreslit více?

Pokud chceme nakreslit 2 čtverce vedle sebe, můžeme zkopírovat kód a mezitím se posunout:

```ts
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V1");

let pen = new Servo(robutek.Pins.Servo2, 1, 4);
robutek.setSpeed(100);

pen.write(robutek.PenPos.Down); // dáme dolů tužku

for (let i: number = 0; i < 4; i++) { // chování opakujeme 4x, pro každou stěnu čtverce
    await robutek.move(0, { distance: 100 }); // posun dopředu o 10 cm
    await robutek.rotate(90); // rotace doprava o 90 stupňů
}
pen.write(robutek.PenPos.Up); // dáme nahoru

await robutek.move(150);

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
import { Servo } from "./libs/servo.js";
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V1");

let pen = new Servo(robutek.Pins.Servo2, 1, 4);
robutek.setSpeed(100);

for (let square: number = 0; square < 4; square++) {
    pen.write(robutek.PenPos.Down);
    for (let i: number = 0; i < 4; i++) {
        await robutek.move(0, { distance: 100 });
        await robutek.rotate(90);
    }
    
    pen.write(robutek.PenPos.Up);
    await robutek.move(0, { distance: 100 });
}

```

Co když se však chceme pohybovat mezi čtverci různě daleko, nebo mít každý jinak velký? Odpovědí na tuto otázku jsou <tt>funkce</tt>.

## Funkce

Funkce je pojmenovaný kus kódu. Tento kus kódu jednou napíšeme, a poté ho ze zbytku programu můžeme libovolně volat (spouštět). Celkově tak zpřehledňuje programy, a dělá je rozšířitelnější.

V programu rozlišujeme mezi definicí funkce a jejím voláním. Definice vypadá následovně:

```ts
import { Servo } from "./libs/servo.js";
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V1");

let pen = new Servo(robutek.Pins.Servo2, 1, 4);
robutek.setSpeed(100);

async function draw_square(): void {
    pen.write(robutek.PenPos.Down);
    for (let i: number = 0; i < 4; i++) {
        await robutek.move(0, { distance: 100 });
        await robutek.rotate(90);
    }
    pen.write(robutek.PenPos.Up);
}
```

Definice funkce se skládá z:
- klíčového slova function
- jména funkce
- seznamu argumentů (v závorkách)
- návratového typu
- těla funkce (ve špičatých závorkách)

Protože v těle funkce používáme klíčové slovo `await`, je potřeba aby funkce byla označena jako `async`.
Znamená to, že je tzv. asynchronní a během čekání na její vykonání se můžou plnit další úkoly.

K argumentům a návratovým hodnotám se dostaneme později, zatím je pro nás zajímavé jednoduše to, že jsme si nějak pojmenovali kus kódu.

Když spustíme tento kód, nic se nestane. Chybí nám totiž funkci <tt>zavolat</tt>. Volání funkce provedeme jejím jménem, následovaným závorkami. Pokud je funkce asynchronní a my chceme čekat na její vykonání než začneme provádět další úkol, před její volání dáme klíčové slovo `await`.
Nakreslení dvou čtverců může tedy vypadat takto:

```ts
import { Servo } from "./libs/servo.js";
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V1");

let pen = new Servo(robutek.Pins.Servo2, 1, 4);
robutek.setSpeed(100);

async function draw_square(): void {
    pen.write(robutek.PenPos.Down);
    for (let i: number = 0; i < 4; i++) {
        await robutek.move(0, { distance: 100 });
        await robutek.rotate(90);
    }
    pen.write(robutek.PenPos.Up);
}

await draw_square();
await robutek.move(0, {distance: 150 });
await draw_square();
```

Program nám nakreslí 2 čtverce, a přinesli jsme si tím následující výhody:
- ze sekvence "nakresli čtverec" "pohni se" "nakresli čtverec" je na první pohled zjevné co se bude dít, a čtenář programu nemusí analyzovat detaily toho, jak přesně kreslení každého čtverce probíhá
- když se rozhodneme, že čtverce mají mít jinou velikost, stačí udělat změnu na jednom místě

!!! warning "Nezapomínejte při volání funkcí které obsahují pohyb na `async`"
    Pokud bychom v předchozím příkladu funkce volali bez `async`, příkazy by se nám bily a 
    robot by udělal ve výsledku nesmyslný pohyb.

Na tak malém příkladu to možná není zjevné, ale i `motors.move()`, které jsme používali doteď, není nic jiného než funkce, která v sobě skrývá nějaký složitější výpočet. Funkce tedy můžeme propojovat různými způsoby, a tvořit tak programy, které toho dělají čím dál více.

Program však neřeší případ, kdy chceme aby každý čtverec měl jinou velikost. V tu chvíli nám pomůžou <tt>argumenty</tt>, které do funkce umíme předat. Jde o proměnné, které existují v dané funkci, a my jim při volání funkce přiřadíme konkrétní hodnotu.

```ts
import { Servo } from "./libs/servo.js";
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V1");

let pen = new Servo(robutek.Pins.Servo2, 1, 4);
robutek.setSpeed(100);

async function draw_square(size: number): void {
    pen.write(robutek.PenPos.Down);
    for (let i: number = 0; i < 4; i++) {
        await robutek.move(0, { distance: size });
        await robutek.rotate(90);
    }
    pen.write(robutek.PenPos.Up);
}

await draw_square(100);
await robutek.move(0, {distance: 150 });
await draw_square(150);
```

Ve funkci používáme proměnný argument `size` značící velikost čtverce, který můžeme při volání nastavit na jakoukoliv hodnotu, a máme vyřešeno.

## Zadání A

Vytvořte funkci, která bere 2 argumenty, a nakreslí obdélník daných rozměrů. Zkuste ji zavolat s rúznými argumenty.

??? note "Řešení"
    ```ts
    import { Servo } from "./libs/servo.js";
    import { createRobutek } from "./libs/robutek.js"
    const robutek = createRobutek("V1");

    let pen = new Servo(robutek.Pins.Servo2, 1, 4);
    robutek.setSpeed(100);
    
    async function draw_rectangle(sizeA: number, sizeB: number): void {
        pen.write(robutek.PenPos.Down);
        for (let i: number = 0; i < 4; i++) {
            if(i % 2 == 0){ // zbytek po dělení 2, tedy každá druhá strana
                await robutek.move(0, { distance: sizeA });
            } else {
                await robutek.move(0, { distance: sizeB });
            }
            await robutek.rotate(90);
        }
        pen.write(robutek.PenPos.Up);
    }

    await draw_rectangle(100, 150);
    await draw_rectangle(150, 50);
    ```

### Vracení hodnot

Kromě toho, že funkce můžou brát argumenty, je také můžou vracet. To je užitečné v případě, že si chceme do funkce dát nějaký výpočet, a zajímá nás jeho výsledek. Hodnotu z funkce vracíme pomocí klíčového slova `return`.

Funkce 
```ts
function add(a: number, b: number): number {
    return a + b;
}
```
tedy bere 2 čísla a vrací výsledek výpočtu nad nimi (zde jen sčítání).

Příklad použití: chceme-li nakreslit pravidelný n-úhelník, vzorec pro vnitřní úhly je podle [wikipedie](https://cs.wikipedia.org/wiki/Pravideln%C3%BD_mnoho%C3%BAheln%C3%ADk)

$$(1 - \frac{2}{n}) * 180$$

kde, `n` je počet stran.

Tento výpočet nechceme psát několikrát, je proto vhodné jej vyčlenit do funkce, která vrací napočítanou hodnotu.

## Zadání B

Napište funkci `draw_polygon()`, která vezme 2 argumenty: počet stran a délku každé strany. Na výpočet úhlu použijte pomocnou funkci, která spočítá jak moc je potřeba zatočit.

??? note "Řešení"
    ```ts
    import { Servo } from "./libs/servo.js";
    import { createRobutek } from "./libs/robutek.js"
    const robutek = createRobutek("V1");

    let pen = new Servo(robutek.Pins.Servo2, 1, 4);
    robutek.setSpeed(100);
    
    function turn_angle(sides: number): number {
        return 180 - (1 - 2 / sides) * 180;
    }

    async function draw_polygon(sides: number, size: number): void {
        pen.write(robutek.PenPos.Down);
        for (let side: number = 0; side < sides; side++) {
            await robutek.move(0, { distance: size });
            await robutek.rotate(turn_angle(sides));
        }
        pen.write(robutek.PenPos.Up);
    }

    await draw_polygon(5, 100);
    await robutek.move(0, { distance: 250 });
    await draw_polygon(8, 100);
    ```


## Výstupní úkol V1 - Domovní vybavení

Opět si nakreslete domeček, tentokrát ale bude zajímavější.
Vytvořte si funkci `draw_window(size)`, která nakreslí 4 malě čtverce, a kolem nich pátý.
Znovu nakreslete domeček, ale tentokrát mu dejte pomocí `draw_window()` několik oken. Kolem domu můžete z n-úhelníků nebo koleček nakreslit ozdobné stromy. Také mu můžete dát dveře a komín.

Pokud se vám nedaří kreslit dobré tvary kvůli nepřesnostem motorů nebo simulátoru, zkuste snížit rychlost,
se kterou se robot pohybuje.

Nakonec můžete celý kód na kreslení domečku dát do vlastní funkce. Vytvořte vesnici tak, že vedle sebe nakreslíte několik domků.



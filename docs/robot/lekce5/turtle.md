# Lekce 5 - funkce

Z minulé lekce už umíme kreslit jednoduché tvary. Co když jich však chceme nakreslit více?

Pokud chceme nakreslit 2 čtverce vedle sebe, můžeme zkopírovat kód a mezitím se posunout:

```ts
import * as motors from "motors"; // ovládání motorů

draw(true);
for (let i: number = 0; i < 4; i++) { // chování opakujeme 4x, pro každou stěnu čtverce
    motors.move(10); // posun dopředu o 10 cm
    motors.rotate(90); // rotace doprava o 90 stupňů
}
draw(false);

motors.move(15);

draw(true);
for (let i: number = 0; i < 4; i++) {
    motors.move(10);
    motors.rotate(90);
}
draw(false);
``` 

To se ještě dá zvládnout, ale pokud bychom to udělali ještě párkrát, kód by se stával velice špatně čitelným.
Pokud bychom se pak rozhodli změnit např. velikost nakreslených čtverců, museli bychom to měnit v každé kopii tohoto kódu, což zabere čas, a je v tom jednoduché udělat chybu.

Můžeme si pomoct tím, co už známe: vnořeným `for` cyklem. Pokud chceme nakreslit např. 4 čtverce za sebou, můžeme to napsat takto:

```ts
import * as motors from "motors"; // ovládání motorů

for (let square: number = 0; square < 4; square++) {
    draw(true);
    for (let i: number = 0; i < 4; i++) { // chování opakujeme 4x, pro každou stěnu čtverce
        motors.move(10); // posun dopředu o 10 cm
        motors.rotate(90); // rotace doprava o 90 stupňů
    }
    draw(false);
    motors.move(15);
}

```

Co když se však chceme pohybovat mezi čtverci různě daleko, nebo mít každý jinak velký? Odpovědí na tuto otázku jsou <tt>funkce</tt>.

## Funkce

Funkce je pojmenovaný kus kódu. Tento kus kódu jednou napíšeme, a poté ho ze zbytku programu můžeme libovolně volat (spouštět). Celkově tak zpřehledňuje programy, a dělá je rozšířitelnější.

V programu rozlišujeme mezi definicí funkce a jejím voláním. Definice vypadá následovně:

```ts
import * as motors from "motors";

function draw_square(): void {
    draw(true);
    for (let i: number = 0; i < 4; i++) {
        motors.move(10);
        motors.rotate(90);
    }
    draw(false);
}
```

Definice funkce se skládá z:
- klíčového slova function
- jména funkce
- seznamu argumentů (v závorkách)
- návratového typu
- těla funkce (ve špičatých závorkách)

K argumentům a návratovým hodnotám se dostaneme později, zatím je pro nás zajímavé jednoduše to, že jsme si nějak pojmenovali kus kódu.

Když spustíme tento kód, nic se nestane. Chybí nám totiž funkci <tt>zavolat</tt>. Volání funkce provedeme jejím jménem, následovaným závorkami. Nakreslení dvou čtverců může tedy vypadat takto:

```ts
import * as motors from "motors";

function draw_square(): void {
    draw(true);
    for (let i: number = 0; i < 4; i++) {
        motors.move(10);
        motors.rotate(90);
    }
    draw(false);
}

draw_square();
motors.move(15);
draw_square();
```

Program nám nakreslí 2 čtverce, a přinesli jsme si tím následující výhody:
- ze sekvence "nakresli čtverec" "pohni se" "nakresli čtverec" je na první pohled zjevné co se bude dít, a čtenář programu nemusí analyzovat detaily toho, jak přesně kreslení každého čtverce probíhá
- když se rozhodneme, že čtverce mají mít jinou velikost, stačí udělat změnu na jednom místě

Na tak malém příkladu to možná není zjevné, ale i `motors.move()`, které jsme používali doteď, není nic jiného než funkce, která v sobě skrývá nějaký složitější výpočet. Funkce tedy můžeme propojovat různými způsoby, a tvořit tak programy, které toho dělají čím dál více.

Program však neřeší případ, kdy chceme aby každý čtverec měl jinou velikost. V tu chvíli nám pomůžou <tt>argumenty</tt>, které do funkce umíme předat. Jde o proměnné, které existují v dané funkci, a my jim při volání funkce přiřadíme konkrétní hodnotu.

```ts
import * as motors from "motors";

function draw_square(size: number): void {
    draw(true);
    for (let i: number = 0; i < 4; i++) {
        motors.move(size);
        motors.rotate(90);
    }
    draw(false);
}

draw_square(10);
motors.move(15);
draw_square(15);
```

Ve funkci používáme proměnný argument `size` značící velikost čtverce, který můžeme při volání nastavit na jakoukoliv hodnotu, a máme vyřešeno.

## Zadání A

Vytvořte funkci, která bere 2 argumenty, a nakreslí obdélník daných rozměrů. Zkuste ji zavolat s rúznými argumenty.

??? note "Řešení"
    ```ts
    import * as motors from "motors";

    function draw_rectangle(size_a: number, size_b: number): void {
        draw(true);
        for (let i: number = 0; i < 4; i++) {
            if(i % 2 == 0){ // zbytek po dělení 2, tedy každá druhá strana
                motors.move(size_a);
            } else {
                motors.move(size_b);
            }
            motors.rotate(90);
        }
        draw(false);
    }

    draw_rectangle(10, 15);
    draw_rectangle(15, 5);
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
    import * as motors from "motors";

    function turn_angle(sides: number): number {
        return 180 - (1 - 2 / n) * 180;
    }
    
    function draw_polygon(sides: number, size: number): void {
        draw(true);
        for (let side: number = 0; side < sides; side++) {
            motors.move(size);
            motors.rotate(turn_angle(sides));
        }
        draw(false);
    }

    draw_polygon(3, 10);
    draw_rectangle(5, 15);
    ```


## Výstupní úkol V1 - Domovní vybavení

Opět si nakreslete domeček, tentokrát ale bude zajímavější.
Vytvořte si funkci `draw_window(size)`, která nakreslí 4 malě čtverce, a kolem nich pátý.
Znovu nakreslete domeček, ale tentokrát mu dejte pomocí `draw_window()` několik oken. Kolem domu můžete z n-úhelníků nakreslit ozdobné stromy.

Nakonec vytvořte vesnici tak, že vedle sebe nakreslíte několik domků.



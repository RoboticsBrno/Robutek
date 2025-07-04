# Simulátor

???+ warning "Varování"

    Simulátor neni aktuální, lépe funguje s dokumentací V1

Tato lekce je určena na práci v [Simulátoru](https://xondika.github.io/sitrusj/). Program obsahuje zjednodušenou verzi reality, ve které nám bude jezdit želvička a přijímat příkazy na základě vnějších podnětů.

Programy nám budou fungovat i na skutečném robotovi. Je však je důležité nejdříve si v simulaci ověřit funkčnost, aby se nám skutečný robot nezačal chovat neočekávaným způsobem a nezpůsobil sobě nebo nám škody.

Program má textové okno, kam můžeme psát příkazy. Nám již známé příkazy jsou:

`robutek.rotate(deg)` - želvička se otočí o `deg` stupňů po směru hodinových ručiček
`robutek.move(direction, options)` - želvička jede některým směrem na základě zadaných parametrů


## Zadání A

V jedné z předchozích lekcí jsme použili znalosti o ovládání motorů a fixy na nakreslení čtverce.
Museli jsme však několikrát pod sebou kopírovat kód na pohyb dopředu a otočení, ačkoliv jsme vykonávali čtyřikrát to stejné. Tentokrát pomocí for cyklu napište kód, díky kterému robot nakreslí čtverec a vrátí se do výchozí polohy.

![](assets/square.png)


??? note "Řešení"
    ```ts
	import { createRobutek } from "./libs/robutek.js"
    const robutek = createRobutek("V2");; // ovládání motorů
    
    let pen = new Servo(robutek.Pins.Servo2, 1, 4);
    pen.write(robutek.PenPos.Down); // dáme dolů tužku

    robutek.setSpeed(100) // nastavíme rychlost na 100 mm/s

    for (let i: number = 0; i < 4; i++) { // chování opakujeme 4x, pro každou stěnu čtverce
        await robutek.move(0, { distance: 200 }); // posun dopředu o 20 cm
        await robutek.rotate(90); // rotace doprava o 90 stupňů
    }
    ```

<!-- Toto chování můžeme také provést v reakci na událost. Modifikujte program tak, aby želvička projela čtverec až po stisknutí tlačítka. -->

<!-- ??? note "Řešení" -->
<!--     ```ts -->
<!-- 	import * as gpio from "gpio"; -->
<!-- 	import * as motors from "motors"; // ovládání motorů -->


<!--     const BTN_PIN = 18; -->
<!-- 	gpio.pinMode(BTN_PIN, gpio.PinMode.INPUT); // nastaví pin 18 jako vstup -->
<!--     gpio.on("falling", BTN_PIN, () => { // reakce na stisk tlačítka -->
<!--         for (let i: number = 0; i < 4; i++) { // chování opakujeme 4x, pro každou stěnu čtverce -->
<!--             motors.move(10); // posun dopředu o 10 cm -->
<!--             motors.rotate(90); // rotace doprava o 90 stupňů -->
<!--         } -->
<!--     }); -->
<!--     ``` -->

## Zadání B

Napište kód, pomocí kterého nakreslíte několik na sebe navazujících kruhů.
Dá se na to využít zatáčení pomocí `motors.move(1)`.
Vzdálenost, kterou je potřeba ujet si dopočítáme na základě toho, že kola jsou od sebe `82mm` daleko. 
Po nakreslení každého kola se můžeme otočit, ale pro plynulý pohyb chceme kreslit každé kolo z jiného směru.
K tomu může pomoct například stavová proměnná, která nám řekne, jestli tentokrát pojedeme doprava, nebo doleva.

![](assets/circles.png)

??? note "Řešení"
    ```ts
	import { createRobutek } from "./libs/robutek.js"
    const robutek = createRobutek("V2");; // ovládání motorů
    
    let pen = new Servo(robutek.Pins.Servo2, 1, 4);
    pen.write(robutek.PenPos.Down); // dáme dolů tužku

    robutek.setSpeed(100) // nastavíme rychlost na 100 mm/s

    let direction: number = 1; // směr otáčení
    let circumference: number = 2 * 3.14 * 82; // obvod jednoho kruhu, který robot objede
    for (let i: number = 0; i < 4; i++) { // chování opakujeme 4x
        await robutek.move(direction, { distance: circumference * 1.5 }); // chceme projet obvod 1,5x
        if( direction == 1 ){
            direction = -1;
        } else {
            direction = 1;
        }
    }
    ```


## Výstupní úkol V1 - Trojúhelník

Napište kód, který způsobí, že želvička nakreslí místo čtverce trojúhelník. Rozměry trojúhelníku jsou na vás, jen musí skutečně jít o trojúhelník.

!!! tip "Jak na Trojúhelníky""
    Tvar s délkami `a`, `b` a `c` nazýváme trojúhelníkem, pokud splňuje trojúhelníkovou nerovnost:
    ```math
    a + b > c
    a + c > b
    b + c > a
    ```

    Nejjednodušší trojúhelník je rovnostranný, který bude mít všechny strany stejně dlouhé a 60° vnitřní úhel na každém rohu.

    Hned po něm následuje rovnoramenný, který v nejjednodušším případě bude mít 90° úhel mezi kratšími stranami, a 45° mezi krátkou a dlouhou.

    Pokud chceme nějaký méně pravidelný trojúhelník, můžeme na výpočet úhlu a délek použít [kosínovu větu](https://cs.wikipedia.org/wiki/Kosinov%C3%A1_v%C4%9Bta).

## Výstupní úkol V2 - Domeček

Propojte dosavadní znalosti do jednoho kódu.
Napište program, který způsobí že si želvička nakreslí domeček z čtverce a trojúhelníkové střechy.

Následně želvička přestane kreslit, a vjede doprostřed domečku, kde zastaví.

### Dobrovolný úkol - Spuštění na vlastním robotovi

Pokud vám program funguje v simulátoru, zkuste si ho nahrát do skutečného robota.
Funguje vám? Pozorujete nějaké rozdíly v jeho chování oproti zjednodušenému prostředí?


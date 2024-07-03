# Lekce 4.5 - želvička

Tato lekce přímo navazuje na předchozí, a ukazuje praktické použití cyklů.

## Želvička

Cykly si vyzkoušíme  v programu `Želvička (TODO název?)`. Program obsahuje zjednodušenou verzi reality, ve které nám bude jezdit želvička a přijímat příkazy na základě vnějších podnětů. 

// TODO Obrázek a link na simulátor

Programy nám budou fungovat i na skutečném robotovi. Je však je důležité nejdříve si v simulaci ověřit funkčnost, aby se nám skutečný robot nezačal chovat neočekávaným způsobem a nezpůsobil sobě nebo nám škody.

Program má textové okno, kam můžeme psát příkazy. Zatím jsou pro nás zajímavé příkazy (TODO přesná specifikace):

`motors.rotate(deg)` - želvička se otočí o `deg` stupňů po směru hodinových ručiček
`motors.move(dist)` - želvička se pohne dopředu o `dist` centimetrů

Zatím pro jednoduchost uvažujme, že se želvička umí buď otáčet, nebo jet dopředu, ale ne obojí zároveň. V kapitole (TODO diferenciální řízení) si ukážeme pokročilejší způsob jak ji řídit.
Jízdu obloukem zatím budeme řešit tak, že opakovaně popojedeme o maličký kousek, a poté se trošku otočíme.

## Zadání A

Napište program, který z výchozí pozice želvičky vyjede o kousek dopředu, objede čtverec, a vrátí se zase zpět.

// TODO gif? nebo prostě ukázat na lekci

??? note "Řešení"
    ```ts
	import * as motors from "motors"; // ovládání motorů

    for (let i: number = 0; i < 4; i++) { // chování opakujeme 4x, pro každou stěnu čtverce
        motors.move(10); // posun dopředu o 10 cm
        motors.rotate(90); // rotace doprava o 90 stupňů
    }
    ```
    
Toto chování můžeme také provést v reakci na událost. Modifikujte program tak, aby želvička projela čtverec až po stisknutí tlačítka.

??? note "Řešení"
    ```ts
	import * as gpio from "gpio";
	import * as motors from "motors"; // ovládání motorů


    const BTN_PIN = 18;
	gpio.pinMode(BTN_PIN, gpio.PinMode.INPUT); // nastaví pin 18 jako vstup
    gpio.on("falling", BTN_PIN, () => { // reakce na stisk tlačítka
        for (let i: number = 0; i < 4; i++) { // chování opakujeme 4x, pro každou stěnu čtverce
            motors.move(10); // posun dopředu o 10 cm
            motors.rotate(90); // rotace doprava o 90 stupňů
        }
    });
    ```

### Kreslení

Želvička kromě jízdy umí i kreslit. Má v sobě tužku, kterou může buď zvednout, nebo položit.
Slouží na to příkaz:

`motors.draw(pravdivostní hodnota)` - Tato funkce určuje, jestli má želvička kreslit, nebo ne. Hodnota `true` nám říká, že máme tužku položenou na zemi (tj. kreslíme), hodnota `false` že nekreslíme.

Na skutečném robotovi nám kreslení bude fungovat po nainstalování fixy podle (TODO manuální konstrukce).

## Zadání B

Vraťme se k předchozímu příkladu. Abychom věděli, že želvička skutečně projela čtverec, necháme ji nakreslit ho. Dopíšeme tedy program tak, aby po stisku tlačítka položila tužku, nakreslila čtverec, a následně tužku zase zvedla.

??? note "Řešení"
    ```ts
	import * as gpio from "gpio";
	import * as motors from "motors"; // ovládání motorů


    const BTN_PIN = 18;
	gpio.pinMode(BTN_PIN, gpio.PinMode.INPUT); // nastaví pin 18 jako vstup
    gpio.on("falling", BTN_PIN, () => { // reakce na stisk tlačítka
        motors.draw(true);
        for (let i: number = 0; i < 4; i++) { // chování opakujeme 4x, pro každou stěnu čtverce
            motors.move(10); // posun dopředu o 10 cm
            motors.rotate(90); // rotace doprava o 90 stupňů
        }
        motors.draw(false);
    });
    ```

## Výstupní úkol V1 - Trojúhelník

Napište kód, který způsobí, že želvička nakreslí místo čtverce trojúhelník. Rozměry trojúhelníku jsou na vás, jen musí skutečně jít o trojúhelník.

!!! tip "Jak na Trojúhelníky (nechť `a`, `b`, `c` jsou délky stran)""
    Trojúhelníková nerovnost, která musí platit pro všechny:
    ```math
    a + b > c
    a + c > b
    b + c > a
    ```
    
    Nejjednodušší trojúhelník je rovnostranný, který bude mít všechny strany stejně dlouhé a 60° úhel na každém rohu.
    
    Hned po něm následuje rovnoramenný, který v nejjednodušším případě bude mít 90° úhel mezi kratšími stranami, a 45° mezi krátkou a dlouhou.
    
    Pokud chceme nějaký méně pravidelný trojúhelník, můžeme na výpočet úhlu a délek použít kosínovu větu (Dodat jako knihovní funkci, tak jako barvičky(?)).

## Výstupní úkol V2 - Domeček

Propojte dosavadní znalosti do jednoho kódu. 
Napište program, který způsobí že si želvička nakreslí domeček z čtverce a trojúhelníkové střechy.

Následně želvička přestane kreslit, a vjede doprostřed domečku, kde zastaví. 

### Dobrovolný úkol - Spuštění na vlastním robotovi

Jakmile máte funkční program v simulátoru, zkuste si ho nahrát do skutečného robota.
Funguje vám? Pozorujete nějaké rozdíly v jeho chování oproti zjednodušenému prostředí?


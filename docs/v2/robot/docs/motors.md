# Docs - Ovládání motorů

Na Robůtkovi se nachází dva stejnosměrné motory s enkodérem (čidlo pro měření pozice motoru). Motory jsou připojené k čipu DRV8833, který zajišťuje jejich řízení a který můžeme ovládat z Jacula.

Protože chceme být schopni přesně řídit rychlost, případně pozici motoru, připravili jsme do Jacula ovladač, který takové řízení umožňuje. Nastavení ovladače pořád ale není úplně jednoduché, takže jsme nachystali knihovnu `robutek.ts`, která motory nastaví a dovolí nám je ovládat pomocí jednoduchých funkcí.

## Import knihovny

Nejprve si musíme knihovnu importovat. To uděláme pomocí příkazu `import`:

```ts
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V2");
```

## Dostupné rozhraní

Po naimportování knihovny vznikne objekt `robutek`, skrze který můžeme s Robůtkem interagovat. K řízení motorů máme k dispozici dva způsoby:

### Samostatné řízení motorů

Pomocí objektů `robutek.leftMotor` a `robutek.rightMotor` můžeme ovládat motory odděleně. Každý z těchto objektů má několik metod, které jsou popsané ve složce `@types/motor.d.ts`.

Pro nás jsou důležité tyto 4 metody:

- `setSpeed(speed: number): void` - nastaví rychlost motoru. Rychlost zadáváme v mm/s a může být kladná i záporná. Kladná rychlost znamená jízdu vpřed, záporná znamená jízdu vzad.
- `async move({ time: number }): void` - motor se začne pohybovat zadanou rychlostí a po zadaném čase se zastaví. Čas zadáváme v milisekundách.
- `async move({ distance: number }): void` - motor se začne pohybovat zadanou rychlostí a po ujetí zadané vzdálenosti se zastaví. Vzdálenost zadáváme v milimetrech.
- `async stop(brake?: boolean): void` - zastaví motor. Pokud je `brake` nastaveno na `true`, motor se zastaví okamžitě. Pokud je `brake` nastaveno na `false`, motor se zastaví postupně.
- `getPosition(): number` - vrátí ujetou vzdálenost v milimetrech.


### Řízení obou motorů najednou

Pro jednodušší řízení pohybu Robůtka máme navíc k dispozici několik funkcí, které umožňují ovládat oba motory najednou:

- `robutek.setSpeed(speed: number): void` - nastaví rychlost obou motorů.
- `async robutek.move(curve: number, { time: number }): void` - Robůtek se začne pohybovat zadanou rychlostí zadaným směrem a po zadaném čase se zastaví.
- `async robutek.move(curve: number, { distance: number }): void` - Robůtek se začne pohybovat zadanou rychlostí zadaným směrem a po ujetí zadané vzdálenosti se zastaví.
- `async robutek.stop(brake?: boolean): void` - zastaví oba motory.

Parametr `curve` určuje, jakým směrem se Robůtek bude pohybovat. Jde o číslo v rozsahu od -1 do 1, kde 0 znamená jízdu rovně, záporné číslo znamená jízdu doleva a kladné číslo znamená jízdu doprava. Kraje rozsahu (-1 a 1) znamenají jízdu doleva nebo doprava na místě.

## Příklad použití

Nyní si ukážeme, jak můžeme ovládat motory Robůtka. Nejprve si musíme importovat knihovnu a poté můžeme začít s ovládáním motorů.

Na začátku programu je rychlost nastavená na 0, takže se motory nebudou pohybovat ani po zavolání funkce `move`. Je tedy potřeba prvně zavolat funkci `setSpeed` a až poté `move`.

```ts
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V2");

robutek.setSpeed(100);
robutek.move(0, { distance: 1000 });
```

Takto můžeme posílat jednotlivé příkazy na pohyb Robůtka, neumíme však popsat sekvenci na sebe navazujících pohybů.

Funkce, které u sebe mají slovíčko `async`, jsou asynchronní. To znamená, že například zavoláním funkce `move` se začne pohyb motoru, ale program se hned přesune na další příkaz. Pokud ale chceme provést nějakou posloupnost pohybů a chceme tedy počkat, až se motor zastaví, musíme použít příkaz `await`. Ten ale nelze používat kdekoliv, bude tedy potřeba upravit program tak, aby nám to dovolil.

```ts
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V2");

async function main() {
    robutek.setSpeed(100);
    await robutek.move(0, { distance: 200 });
    await robutek.rotate(90);
    await robutek.move(0, { distance: 200 });
}

main().catch(console.error);
```

V tomto příkladu se Robůtek nejprve posune o 200 mm vpřed, poté se otočí o 90 stupňů a nakonec se posune o dalších 200 mm vpřed.
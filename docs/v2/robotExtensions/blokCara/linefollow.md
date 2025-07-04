# Jednoduché sledování čáry

## Základní myšlenka

Na začátku předpokládáme, že se je čára mezi dvěma přednímy senzory. Na vstup ze senzorů budeme reagovat takto:

- Čára je uprostřed: Jedeme rovně
- Čára je vlevo: Jedeme doleva
- Čára je vpravo: Jedeme doprava

## Program

Senzor nám barvu popíše jako číslo od 0 do 1023, nás ale nezajímá konkrétní číslo, ale zda se ta barva ještě dá považovat za bílou a nebo už je to černá, to znamená zvolit si nějakou prahovou hodnotu (threshold) ve které se bude naše vnímání barvy lámat.

```ts
const thresh = 700; // Mez pod kterou se barva považuje za černou TODO: Ověřit že to tak reálně je
```

Nastavíme, že motory mají jet:

```ts
robutek.leftMotor.move();
robutek.rightMotor.move();
```

Nakonec musíme napsat hlavní část programu. Ve while cyklu neustále kontrolujeme stav senzorů a nastavujeme výkon motorů. V cyklu nesmíme zapomenout na krátký await sleep() abychom se vyhnuli problémům s watchdogem.

```ts
while(true) {
    const l = robutek.readSensor("LineFL");
    const r = robutek.readSensor("LineFR");
    if(l < thresh) {
        robutek.leftMotor.setSpeed(100);
        robutek.rightMotor.setSpeed(10);
    } else if(r < thresh) {
        robutek.leftMotor.setSpeed(10);
        robutek.rightMotor.setSpeed(100);
    } else {
        robutek.leftMotor.setSpeed(500);
        robutek.leftMotor.setSpeed(500);
    }
    await sleep(10);
}
```

Celý program pak může vypadat nějak takto:

```ts
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V2");
const thresh = 700; // Mez pod kterou se barva považuje za černou
async function main() {
    robutek.leftMotor.move();
    robutek.rightMotor.move();
    while(true) {
        const l = robutek.readSensor("LineFL");
        const r = robutek.readSensor("LineFR");
        if(l < thresh) {
            robutek.leftMotor.setSpeed(100);
            robutek.rightMotor.setSpeed(10);
        } else if(r < thresh) {
            robutek.leftMotor.setSpeed(10);
            robutek.rightMotor.setSpeed(100);
        } else {
            robutek.leftMotor.setSpeed(500);
            robutek.leftMotor.setSpeed(500);
        }
        console.log(`l: ${l}; r: ${r}`);
        await sleep(100);
    }
}
main().catch(console.error);
```
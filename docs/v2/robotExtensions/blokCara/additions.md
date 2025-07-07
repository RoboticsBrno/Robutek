# Vylepšené sledování čáry

## Jízda na jeden senzor

V předchozím příkladu jsme se ptali na otázku jestli čára pod senzorem je, nebo není a spokojili jsme se jenom s odpovědí ano/ne. Naše čárové senzory ale mají určitý rozptyl. Pokud senzor sedí na pomezí černé a bílé, tak nám bude říkat, že vidí šedou barvu někde mezi. Toho můžeme využít.

Řekněme, že pracujeme s levým senzorem. Pak budeme předpokládat, že čára je napravo od něj a ztmavující se povrch pod senzorem znamená, že jedeme příliš doprava a zesvětlující se povrch znamená že jedeme příliš doleva. Ideální stav bude, pokud bude senzor nad hranicí bílé a černé.

```ts
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V2");
const thresh = 500; // Mez pod kterou se barva považuje za černou
async function main() {
    robutek.leftMotor.move();
    robutek.rightMotor.move();
    while(true) {
        const l = robutek.readSensor("LineFR");
        if(l > thresh) {
            robutek.leftMotor.setSpeed(100);
            robutek.rightMotor.setSpeed(10);
        } else {
            robutek.leftMotor.setSpeed(10);
            robutek.rightMotor.setSpeed(100);
        }
        await sleep(1);
    }
}
main().catch(console.error);
```

## Jemnější styl jízdy

Robůtek s sebou škube tam a zpátky, jak bychom to mohli vyřešit. Dřív jsme věděli, že čára je pod jedním senzorem, druhým senzorem a nebo "někde mezi". Teď ale víme jak moc mimo jsme a tak můžeme reagovat přiměřeně. Zvolíme si nějaký koeficient k_p, kterým vynásobíme rozdíl mezi ideální a reálnou pozicí vůči čáře a toto číslo použijeme při zatáčení

```ts
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V2");
const setpoint = 512;
const k_p = 0.5;
async function main() {
    robutek.setSpeed(300);
    while(true) {
        const l = robutek.readSensor("LineFR");
        let error = setpoint - l;
        let normalized_error = error / 512;
        robutek.move(normalized_error * k_p);
        await sleep(1);
    }
}
main().catch(console.error);
```

## Vyhlazení kmitů

Robůtek už jezdí plynuleji a snad i rychleji. Dost možná se ale pořád třepe, ale i to se dá řešit. Můžeme si změřit rychlost s jakou se přibližuje/vzdaluje čáře a při příliš velké rychlosti změny "povolit otěže" (jet rovněji). Rychlost přibližování/vzdalování se čáře změříme jako rozdíl výstupu ze senzoru ve dvou po sobě jdoucích průchodech while cyklem. Takto získané číslo opět vynásobíme nějakým koeficientem k_d a výsledek odečteme od korekce vypočítané pomocí. Tento způsob řízení robůtka se nazývá PD regulace.

!!! tip "k_d je často potřeba nastavit opravdu velké pro dosažení plynule jízdy!"

```ts

import { createRobutek } from "./libs/robutek.js"
import Layout from "./layout.js"
const robutek = createRobutek("V2");
const setpoint = 512;
let speed = 789;
let k_p = 0.96;
let k_d = 4.86;

function move(steering: number, speed: number) {
    if(steering < 0) {
        robutek.leftMotor.setSpeed((1 + steering) * speed)
        robutek.rightMotor.setSpeed(speed)
    } else if(steering > 0) {
        robutek.rightMotor.setSpeed((1 - steering) * speed)
        robutek.leftMotor.setSpeed(speed)
    }
}

async function main() {
    let previous_error = 0;
    robutek.leftMotor.move()
    robutek.rightMotor.move()
    console.log("start")
    while(true) {
        const l = robutek.readSensor("LineFR");
        let error = setpoint - l;
        let normalized_error = error / 512;
        let speed_of_change = normalized_error - previous_error;
        move(normalized_error * k_p + speed_of_change * k_d, speed);
        previous_error = normalized_error;
        await sleep(1);
    }
}

main().catch(console.error);
```

!!! tip "K určení hodnot k_d a k_p je potřeba experimentovat. Hodí se naprogramovat si GUI v GridUI abyste kvůli každé změně parametů nemuseli nahrávat kód znovu"

## Co dál

- Naše řídící algoritmy v této kapitole jezdí jenom na jeden senzor, dají se ale upravit tak, aby fungovaly se dvěma přednímy senzory.

- Co má robot dělat pokud sjede z čáry? Máme boční senzory, kterými bychom si mohli pomoct, včas rozpoznat sjetí z čáry a vrátit se na ni.

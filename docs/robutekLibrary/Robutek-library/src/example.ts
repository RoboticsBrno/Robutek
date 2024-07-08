import * as colors from "./libs/colors.js"
import * as Robutek from "./libs/robutek.js"
import { SmartLed } from "smartled"
import { Servo } from "./libs/servo.js";

const ledStrip = new SmartLed(Robutek.LedStrip.Pin, Robutek.LedStrip.Count, Robutek.LedStrip.Type);

ledStrip.set(0, colors.green); // nastaví barvu LED na desce na zelenou, LED na pásku začínají od 1
ledStrip.show(); // zobrazí nastavení na LED

const pen = new Servo(Robutek.Pen.Pin, Robutek.Pen.Timer, Robutek.Pen.Channel);

Robutek.setSpeed(150); // nastaví rychlost robota na 150 mm/s

async function main() {
    await sleep(1000);
    pen.write(Robutek.Pen.Up);
    await sleep(1000);
    pen.write(Robutek.Pen.Down);

    await sleep(1000);
    await Robutek.move(0, { distance: 100 }); // posune se o 100 mm dopředu
    await sleep(1000);
    await Robutek.rotate(180); // otočí se o 180 stupňů doprava
    await sleep(1000);
    Robutek.stop(); // zastaví robota (možný argument brake)


    // you can also use the motors directly
    Robutek.leftMot.setSpeed(100); // nastaví rychlost motoru na 100 mm/s
    await Robutek.leftMot.move({distance: 100}); // posune motor o 100 mm
}
main();



setInterval(() => { // pravidelně vyvolává událost
    console.log("Robotický tábor 2024, zdraví Jirka Vácha!"); // vypíše text: Robotický tábor 2024, zdraví Jirka Vácha!
}, 1000); // čas opakování se udává v milisekundách (1000 ms je 1 sekunda)

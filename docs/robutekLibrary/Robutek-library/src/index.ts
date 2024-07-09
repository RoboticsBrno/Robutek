import * as colors from "./libs/colors.js"
import { LED_WS2812, SmartLed } from "smartled"
import * as robutek from "./libs/robutek.js"
import * as gpio from "gpio"

const ledStrip = new SmartLed(48, 1, LED_WS2812);

gpio.pinMode(0, gpio.PinMode.INPUT_PULLUP);
gpio.pinMode(2, gpio.PinMode.INPUT_PULLUP);


import { Servo } from "./libs/servo.js"

const SERVO_PIN = 38;
const servo = new Servo(SERVO_PIN, 1, 4);

gpio.on("falling", 0, () => {
});

gpio.on("falling", 2, () => {
});

robutek.setSpeed(100);
async function main() {


    servo.write(robutek.PenPos.Down);
    await sleep(1000);
    await robutek.move(0, { distance: 50 });
    await sleep(1000);
    servo.write(robutek.PenPos.Up);
    await robutek.move(0, { distance: -50 });
    await sleep(1000);

    await robutek.rotate(360);

    servo.write(robutek.PenPos.Down);
    await sleep(1000);
    await robutek.move(0, { distance: 50 });
    await sleep(1000);
    servo.write(robutek.PenPos.Up);
    await robutek.move(0, { distance: -50 });
    await sleep(1000);
}

main();

ledStrip.set(0, colors.green); // nastaví barvu LED na desce na zelenou, LED na pásku začínají od 1
ledStrip.show(); // zobrazí nastavení na LED

setInterval(() => { // pravidelně vyvolává událost
    console.log("Robotický tábor 2024, zdraví Jirka Vácha!"); // vypíše text: Robotický tábor 2024, zdraví Jirka Vácha!
}, 1000); // čas opakování se udává v milisekundách (1000 ms je 1 sekunda)

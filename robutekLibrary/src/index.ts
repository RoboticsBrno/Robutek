import { createRobutek } from "./libs/robutek.js"
import * as colors from "./libs/colors.js"
import { LED_WS2812, SmartLed } from "smartled"


const robutek = createRobutek("V2");
const ledStrip = new SmartLed(robutek.Pins.ILED, 1, LED_WS2812); // Pins.ILED je pin 48

ledStrip.set(0, colors.green); // nastaví barvu LED na desce na zelenou, LED na pásku začínají od 1
ledStrip.show(); // zobrazí nastavení na LED

setInterval(() => { // pravidelně vyvolává událost
    console.log("Robotický tábor 2024, zdraví Jirka Vácha!"); // vypíše text: Robotický tábor 2024, zdraví Jirka Vácha!
}, 1000); // čas opakování se udává v milisekundách (1000 ms je 1 sekunda)

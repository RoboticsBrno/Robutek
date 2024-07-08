import "./example.js"

import * as colors from "./libs/colors.js"
import * as Robutek from "./libs/robutek.js"
import { SmartLed } from "smartled"

const ledStrip = new SmartLed(Robutek.LedStrip.Pin, Robutek.LedStrip.Count, Robutek.LedStrip.Type);

ledStrip.set(0, colors.green); // nastaví barvu LED na desce na zelenou, LED na pásku začínají od 1
ledStrip.show(); // zobrazí nastavení na LED

setInterval(() => { // pravidelně vyvolává událost
    console.log("Robotický tábor 2024, zdraví Jirka Vácha!"); // vypíše text: Robotický tábor 2024, zdraví Jirka Vácha!
}, 1000); // čas opakování se udává v milisekundách (1000 ms je 1 sekunda)

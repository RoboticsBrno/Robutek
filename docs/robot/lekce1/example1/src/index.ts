import { SmartLed, LED_WS2812 } from "smartled";
import * as colors from "./libs/colors.js"

const ledStrip = new SmartLed(48, 1, LED_WS2812);  // připojí pásek na pin 48, s 1 ledkou a typem WS2812

ledStrip.set(0, colors.green); // nastaví barvu LED na ESP32 na zelenou
ledStrip.show(); // zobrazí nastavení na LED

setInterval(() => { // pravidelně vyvolává událost
    console.log("Robotický tábor 2024, zdraví Jirka Vácha!"); // vypíše text: Robotický tábor 2024, zdraví Jirka Vácha!
}, 1000); // čas opakování se udává v milisekundách (1000 ms je 1 sekunda)

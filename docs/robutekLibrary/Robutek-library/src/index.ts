import * as colors from "./libs/colors.js"
import * as Robutek from "./libs/robutek.js"

Robutek.init();

Robutek.ledStrip.set(0, colors.green); // nastaví barvu LED na desce na zelenou, LED na pásku začínají od 1
Robutek.ledStrip.show(); // zobrazí nastavení na LED

Robutek.LeftMot.setSpeed(100); // nastaví rychlost motoru na 100 RPM
Robutek.LeftMot.move({distance: 100}); // posune motor na 100 ticků

setInterval(() => { // pravidelně vyvolává událost
    console.log("Robotický tábor 2024, zdraví Jirka Vácha!"); // vypíše text: Robotický tábor 2024, zdraví Jirka Vácha!
}, 1000); // čas opakování se udává v milisekundách (1000 ms je 1 sekunda)

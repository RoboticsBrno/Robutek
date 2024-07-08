import * as Robutek from "./libs/robutek.js"

Robutek.init()

Robutek.ledStrip.clear();
Robutek.ledStrip.set(0, { r: 255, g: 0, b: 0 });
Robutek.ledStrip.show();


console.log("Robotický tábor 2024")

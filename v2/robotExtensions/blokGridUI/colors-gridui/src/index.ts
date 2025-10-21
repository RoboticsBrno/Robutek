import * as colors from "./libs/colors.js";
import * as gpio from "gpio";
import { SmartLed, LED_WS2812 } from "smartled";
import Layout from "./layout.js";
import * as wifi from "wifi";
import { createRobutek } from "./libs/robutek.js";
const robutek = createRobutek("V2");

const ledStrip = new SmartLed(48, 1, LED_WS2812);  // připojí pásek na pin 48, s 1 ledkou a typem WS2812

// Změň mě!
const OWNER = "owner";
const DEVICE_NAME = "robutek";

let text = "rgb(0 0 0)";

function colorToRgbString(col:colors.Rgb){ // překládá rgb barvu na string pro GridUI
    return "rgb(" + Math.trunc(col.r) + " " + Math.trunc(col.g) + " " + Math.trunc(col.b) + ")"
};

setInterval(() => {
    Layout.Led.on = !Layout.Led.on; // bliká ledkou na rozhraní GridUI
    console.log("blik");
}, 500);


Layout.begin(OWNER, DEVICE_NAME, builder => {
    builder.SetColor.onChanged(slider => {
        const col = colors.rainbow(slider.value);
        ledStrip.set(0, col); // nastavuje barvu ledky na desce
        ledStrip.show();

        text = colorToRgbString(col);
        Layout.Led.color = text; // nastavuje barvu ledky na rozhraní
        Layout.Text.text = text; // vypisuje rgb kód v textovém poli na rozhraní
        
    });
});

console.log("Otevři aplikaci RBController nebo otevři prohlížeč a zadej IP: http://" + wifi.currentIp() + " pro ovládání robota.");
Layout.SetColor.value = 180;
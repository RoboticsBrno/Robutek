import * as robutek from "./libs/robutek.js"
import * as wifi from "wifi";
import { SmartLed, LED_WS2812 } from "smartled"
import Layout from "./layout.js"
import * as colors from "./libs/colors.js"

const ledStrip = new SmartLed(48, 1, LED_WS2812);  // připojí pásek na pin 48, s 1 ledkou a typem WS2812

// Změň mě!
const OWNER = "owner";
const DEVICE_NAME = "robutek";

let text = "#ffffff";
let r = "ff"
let g = "ff"
let b = "ff"

function colorToHexString(color:colors.Rgb) { //překládá barvu na string požadovaný GridUI (#ffffff)
    r =  Math.trunc(color.r).toString(16)
    g = Math.trunc(color.g).toString(16)
    b = Math.trunc(color.b).toString(16)
    if (r.length === 1) {
        r = "0" + r;
    } 
    if (g.length === 1) {
        g = "0" + g;
    } 
    if (b.length === 1) {
        b = "0" + b;
    }
    text = "#" + r + g + b;
    return text
}

setInterval(() => {
    Layout.Led.on = !Layout.Led.on; // bliká ledkou na rozhraní
}, 500);


Layout.begin(OWNER, DEVICE_NAME, builder => {
    builder.SetColor.onChanged(slider => {
        ledStrip.set(0, colors.rainbow(slider.value)) // nastavuje barvu ledky na desce
        ledStrip.show()
        text = colorToHexString(colors.rainbow(slider.value));
        Layout.Led.color = text; // nastavuje barvu ledky na rozhraní
        Layout.Text.text = text; // vypisuje rgb kód v textovém poli na rozhraní
    })
});

console.log("Otevři aplikaci RBController nebo otevři prohlížeč a zadej IP: http://" + wifi.currentIp() + " pro ovládání robota.");

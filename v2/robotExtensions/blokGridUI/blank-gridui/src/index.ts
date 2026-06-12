import * as wifi from "wifi";
import { SmartLed, LED_WS2812 } from "smartled";
import Layout from "./layout.js";
import { createRobutek } from "./libs/robutek.js";
import { log } from "gridui";
const robutek = createRobutek("V2");


// Změň mě!
const OWNER = "owner";
const DEVICE_NAME = "robutek";

Layout.begin(OWNER, DEVICE_NAME, builder => {
    
});

console.log("Otevři aplikaci RBController nebo otevři prohlížeč a zadej IP: http://" + wifi.currentIp() + " pro ovládání robota.");



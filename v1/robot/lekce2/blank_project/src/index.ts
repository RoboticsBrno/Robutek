import * as colors from "./libs/colors.js"
import * as gpio from "gpio"
import { SmartLed, LED_WS2812 } from "smartled"
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V1");

import { Pins } from "./libs/robutek.js"
import * as colors from "./libs/colors.js"
import * as gpio from "gpio"
import { SmartLed, LED_WS2812 } from "smartled"
import { createRobutek } from "./libs/robutek.ts"
const robutek = createRobutek("V2");

import { stdin } from "stdio";
import * as Robot from "./libs/robot.js";
import * as gpio from "gpio";
import * as colors from "./libs/colors.js";
import * as motors from "./libs/custom_motors.js";
Robot.init();
const pen = new Robot.Pen(38);
const sensors = new Robot.Sensors();
const strip = new Robot.Strip();
const LMOT = new motors.Motor(11, 12, 1, 2, 3);
const RMOT = new motors.Motor(45, 13, 1, 4, 5);
function mapRange(fromMin, fromMax, toMin, toMax, number) {
    return ((number - fromMin) * (toMax - toMin)) / (fromMax - fromMin) + toMin;
}
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
gpio.pinMode(0, gpio.PinMode.INPUT_PULLUP); // nastavíme pin na input pullup
gpio.pinMode(2, gpio.PinMode.INPUT_PULLUP); // nastavíme pin na input pullup
gpio.on("falling", 0, () => {
    pen.move(Robot.Pen.DOWN);
});
gpio.on("falling", 2, () => {
    pen.move(Robot.Pen.UP);
});
async function readSensors() {
    const max_val = 300;
    const max_rgb = 5;
    let sens_1 = clamp(mapRange(20, 1023, 0, max_val, await sensors.read('W_FR')), 0, max_rgb);
    strip.set(1, { r: sens_1, g: sens_1, b: sens_1 });
    let sens_2 = clamp(mapRange(20, 1023, 0, max_val, await sensors.read('W_FL')), 0, max_rgb);
    strip.set(2, { r: sens_2, g: sens_2, b: sens_2 });
    let sens_3 = clamp(mapRange(20, 1023, 0, max_val, await sensors.read('W_BL')), 0, max_rgb);
    strip.set(3, { r: sens_3, g: sens_3, b: sens_3 });
    let sens_4 = clamp(mapRange(20, 1023, 0, max_val, await sensors.read('W_BR')), 0, max_rgb);
    strip.set(4, { r: sens_4, g: sens_4, b: sens_4 });
    let sens_5 = clamp(mapRange(20, 1023, 0, max_val, await sensors.read('L_FR')), 0, max_rgb);
    strip.set(5, { r: sens_5, g: sens_5, b: sens_5 });
    let sens_6 = clamp(mapRange(20, 1023, 0, max_val, await sensors.read('L_FL')), 0, max_rgb);
    strip.set(6, { r: sens_6, g: sens_6, b: sens_6 });
    let sens_7 = clamp(mapRange(20, 1023, 0, max_val, await sensors.read('L_BL')), 0, max_rgb);
    strip.set(7, { r: sens_7, g: sens_7, b: sens_7 });
    let sens_8 = clamp(mapRange(20, 1023, 0, max_val, await sensors.read('L_BR')), 0, max_rgb);
    strip.set(8, { r: sens_8, g: sens_8, b: sens_8 });
}
setInterval(() => {
    readSensors();
}, 500);
let hue = 0;
async function rgb() {
    //for (let i = 0; i < 9; i++) {
    //    let h = hue
    //    strip.set(i, colors.rainbow((hue + (12 * i)) % 360, 5));
    //}
    strip.set(0, colors.rainbow(hue % 360, 5));
    hue += 1;
    strip.show();
}
setInterval(() => {
    rgb();
}, 20);
let closeCon = false;
let speed = 0.5;
function onGet(data) {
    switch (data) {
        case "1":
            speed = 0.1;
            break;
        case "2":
            speed = 0.2;
            break;
        case "3":
            speed = 0.3;
            break;
        case "4":
            speed = 0.4;
            break;
        case "5":
            speed = 0.5;
            break;
        case "6":
            speed = 0.6;
            break;
        case "7":
            speed = 0.7;
            break;
        case "8":
            speed = 0.8;
            break;
        case "9":
            speed = 0.9;
            break;
        case "0":
            speed = 1;
            break;
        case "w":
            Robot.move(0, 10, 10);
            LMOT.write(speed);
            RMOT.write(speed);
            break;
        case "s":
            LMOT.write(-speed);
            RMOT.write(-speed);
            break;
        case "a":
            LMOT.write(-speed);
            RMOT.write(speed);
            break;
        case "d":
            LMOT.write(speed);
            RMOT.write(-speed);
            break;
        case " ":
            LMOT.write(0);
            RMOT.write(0);
            break;
        case "q":
            LMOT.write(0);
            RMOT.write(0);
            closeCon = true;
            break;
        default:
            break;
    }
    if (!closeCon) {
        stdin.get().then((data) => onGet(data)); // recursive function
    }
}
stdin.get().then((data) => onGet(data)); // start
/*import * as motors from "motors"

const leftMotor:motors.MotorConf = {neg: 1, pos: 2, encA:3, encB:4, encTicks:200}
const rightMotor:motors.MotorConf = {neg: 5, pos: 6, encA:7, encB:8, encTicks:200, reverse:true}

const wheels = new motors.Wheels({left:leftMotor, right:rightMotor, diameter:20, width:100})

wheels.move(0, {distance:10})



import { SmartLed, LED_WS2812 } from "smartled";
import * as colors from "./libs/colors.js"
import * as gpio from "gpio";
import { stdout } from "stdio";
import * as adc from "adc";
import * as readline from "./libs/readline.js"
import * as radio from "simpleradio"
import * as motor from "./libs/motors.js"

const A1 = 11;
const A2 = 12;
const B1 = 45;
const B2 = 11;


const motor_1 = new motor.Motor(A1, A2, 1, 2, 3, false);
const motor_2 = new motor.Motor(B1, B2, 1, 4, 5, false);

radio.begin(8);
radio.on("string", (str:string, info:radio.PacketInfo) => {
    let values = str.split(";")
    motor_1.write(Number(values[0]))
    motor_2.write(Number(values[1]))
})


async function test() {

    motor_1.write(0);
    await sleep(1000);
    motor_1.write(0.5);
    await sleep(1000);
    motor_1.write(1);
    await sleep(1000);
    motor_1.write(0);
    await sleep(1000);
    motor_1.write(-1);
    await sleep(1000);
    motor_1.write(0);
}

test()*/ 

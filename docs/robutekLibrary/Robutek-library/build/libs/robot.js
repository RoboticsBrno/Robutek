/*
import * as motors from "motors"

const leftMotor: motors.MotorConf = { neg: 1, pos: 2, encA: 3, encB: 4, encTicks: 200 }
const rightMotor: motors.MotorConf = { neg: 5, pos: 6, encA: 7, encB: 8, encTicks: 200, reverse: true }

const wheels = new motors.Wheels({ left: leftMotor, right: rightMotor, diameter: 20, width: 100 })
*/
import * as adc from "adc";
import * as gpio from "gpio";
import { Servo } from "./servo.js";
import { SmartLed, LED_WS2812 } from "smartled";
export function init() {
    adc.configure(Sensors.S_1, adc.Attenuation.Db0); // pin senzoru nakonfigurujeme s útlumem nastaveným na 0
    adc.configure(Sensors.S_2, adc.Attenuation.Db0); // pin senzoru nakonfigurujeme s útlumem nastaveným na 0        
    adc.configure(Sensors.S_3, adc.Attenuation.Db0); // pin senzoru nakonfigurujeme s útlumem nastaveným na 0        
    adc.configure(Sensors.S_4, adc.Attenuation.Db0); // pin senzoru nakonfigurujeme s útlumem nastaveným na 0
    gpio.pinMode(Sensors.S_PWR, gpio.PinMode.OUTPUT); // nastavíme mód pinu podsvícení na output 
    gpio.pinMode(Sensors.S_SW, gpio.PinMode.OUTPUT);
    gpio.write(Sensors.S_PWR, 1); // zapneme podsvícení robůtka
}
export function move(curve, distance, time) {
    //wheels.move(curve, {distance:distance, time:time})
}
export function rotate(angle) {
    //wheels.rotate(angle)
}
export function stop() {
    //wheels.stop()
}
export class Sensors {
    constructor() {
        this.sw = 0;
    }
    async switch_sensors(to_value) {
        if (to_value == this.sw) {
            return;
        }
        this.sw = to_value;
        gpio.write(Sensors.S_SW, to_value);
        await sleep(5);
    }
    async read(sensor) {
        switch (sensor) {
            case 'W_FR':
                this.switch_sensors(0);
                return adc.read(Sensors.S_1);
            case 'W_FL':
                this.switch_sensors(0);
                return adc.read(Sensors.S_2);
            case 'W_BL':
                this.switch_sensors(0);
                return adc.read(Sensors.S_3);
            case 'W_BR':
                this.switch_sensors(0);
                return adc.read(Sensors.S_4);
            case 'L_FR':
                this.switch_sensors(1);
                return adc.read(Sensors.S_1);
            case 'L_FL':
                this.switch_sensors(1);
                return adc.read(Sensors.S_2);
            case 'L_BL':
                this.switch_sensors(1);
                return adc.read(Sensors.S_3);
            case 'L_BR':
                this.switch_sensors(1);
                return adc.read(Sensors.S_4);
            default:
                return 0;
        }
    }
}
Sensors.S_1 = 4;
Sensors.S_2 = 5;
Sensors.S_3 = 6;
Sensors.S_4 = 7;
Sensors.S_SW = 8;
Sensors.S_PWR = 47;
export class Pen {
    constructor(pin) {
        this.servo = new Servo(pin, 1, 0);
    }
    /**
     * Set the pen servo position.
     * @param value The position to set the servo to, from 0 to 1023.
     */
    move(value) {
        this.servo.write(value);
    }
}
Pen.UP = 512 + 180;
Pen.DOWN = 512 - 180;
Pen.MIDDLE = 512;
Pen.UNLOAD = 0;
export class Strip {
    constructor() {
        this.strip = new SmartLed(48, 9, LED_WS2812);
    }
    set(index, color) {
        this.strip.set(index, color);
    }
    fill(color) {
        for (let i = 0; i < 9; i++) {
            this.strip.set(i, color);
        }
    }
    show() {
        this.strip.show();
    }
    clear() {
        this.strip.clear();
    }
}


import * as adc from "adc";
import * as gpio from "gpio";

import { Servo } from "./servo.js";

import { SmartLed, LED_WS2812, Rgb } from "smartled";

/*
import * as motors from "motors"

const leftMotor: motors.MotorConf = { neg: 1, pos: 2, encA: 3, encB: 4, encTicks: 200 }
const rightMotor: motors.MotorConf = { neg: 5, pos: 6, encA: 7, encB: 8, encTicks: 200, reverse: true }

const wheels = new motors.Wheels({ left: leftMotor, right: rightMotor, diameter: 20, width: 100 })
*/

import * as motors from "./simplemotors.js"

const LMOT = new motors.Motor(11, 12, 1, 2, 3);
const RMOT = new motors.Motor(45, 13, 1, 4, 5);



export function init() {
    adc.configure(Sensors.S_1, adc.Attenuation.Db0); // pin senzoru nakonfigurujeme s útlumem nastaveným na 0
    adc.configure(Sensors.S_2, adc.Attenuation.Db0); // pin senzoru nakonfigurujeme s útlumem nastaveným na 0
    adc.configure(Sensors.S_3, adc.Attenuation.Db0); // pin senzoru nakonfigurujeme s útlumem nastaveným na 0
    adc.configure(Sensors.S_4, adc.Attenuation.Db0); // pin senzoru nakonfigurujeme s útlumem nastaveným na 0

    gpio.pinMode(Sensors.S_PWR, gpio.PinMode.OUTPUT); // nastavíme mód pinu podsvícení na output
    gpio.pinMode(Sensors.S_SW, gpio.PinMode.OUTPUT);

    gpio.write(Sensors.S_PWR, 1); // zapneme podsvícení robůtka
}



type MoveDuration = {
    distance?: number; // distance in cm
    speed?: number; // speed in mm/s?
}
export async function move(curve: number, duration?: MoveDuration) {
    // curve = -1 to 1

    // Ensure the curve is between -1 and 1
    if (curve < -1) curve = -1;
    if (curve > 1) curve = 1;

    if (duration.speed != undefined) {
        // Just a temporary motor driver


        // Calculate motor speeds
        let m1: number;
        let m2: number;

        if (curve >= 0) {
            // Curve from 0 to 1 (m1 is max, m2 decreases)
            m1 = duration.speed;
            m2 = duration.speed * (1 - curve);
        } else {
            // Curve from -1 to 0 (m2 is max, m1 decreases)
            m1 = duration.speed * (1 + curve); // curve is negative, so this increases from 0 to speed
            m2 = duration.speed;
        }

        LMOT.write(m1)
        RMOT.write(m2)

    }

    //await wheels.move(curve, duration)
}


type RotateDuration = {
    angle?: number; // angle in degrees
    speed?: number; // speed in mm/s?
}
export function rotate(duration: RotateDuration) {

    if (duration.angle < 0) {
        LMOT.write(duration.speed);
        RMOT.write(-duration.speed);
    } else {
        LMOT.write(-duration.speed);
        RMOT.write(duration.speed);
    }

    //wheels.rotate(duration)
}

export function stop() {
    LMOT.write(0);
    RMOT.write(0);

    //wheels.stop()
}


export type SensorType = 'W_FR' | 'W_FL' | 'W_BL' | 'W_BR' | 'L_FR' | 'L_FL' | 'L_BL' | 'L_BR';
export class Sensors {

    public static readonly S_1: number = 4;
    public static readonly S_2: number = 5;
    public static readonly S_3: number = 6;
    public static readonly S_4: number = 7;
    public static readonly S_SW: number = 8;
    public static readonly S_PWR: number = 47;

    private sw: number = 0;


    private async switch_sensors(to_value: number) {
        if (to_value == this.sw) {
            return;
        }
        this.sw = to_value;
        gpio.write(Sensors.S_SW, to_value);
        await sleep(5);
    }

    public async read(sensor: SensorType): Promise<number> {
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

export class Pen {
    private servo: Servo;

    public static readonly UP = 512 + 180;
    public static readonly DOWN = 512 - 180;
    public static readonly MIDDLE = 512;
    public static readonly UNLOAD = 0;

    constructor(pin: number) {
        this.servo = new Servo(pin, 1, 0);
    }

    /**
     * Set the pen servo position.
     * @param value The position to set the servo to, from 0 to 1023.
     */
    public move(value: number) {
        this.servo.write(value);
    }
}

export class Strip {
    private strip: SmartLed;

    constructor() {
        this.strip = new SmartLed(48, 9, LED_WS2812);
    }

    public set(index: number, color: Rgb) {
        this.strip.set(index, color);
    }

    public fill(color: Rgb) {
        for (let i = 0; i < 9; i++) {
            this.strip.set(i, color);
        }
    }

    public show() {
        this.strip.show();
    }

    public clear() {
        this.strip.clear();
    }
}

export class Pins {
    public static readonly Status_LED: number = 46;

    public static readonly M1_1 = 11;
    public static readonly M1_2 = 12;
    public static readonly M2_1 = 45;
    public static readonly M2_2 = 13;
    public static readonly ENC1_1 = 39;
    public static readonly ENC1_2 = 40;
    public static readonly ENC2_1 = 41;
    public static readonly ENC2_2 = 42;
}

import * as adc from "adc";
import * as gpio from "gpio";

import { Servo } from "./servo.js";

import { SmartLed, LED_WS2812, Rgb } from "smartled";

import * as motors from "motor"

const leftMotorPins: motors.MotorPins = { motA: 11, motB: 12, encA: 39, encB: 40 }
const rightMotorPins: motors.MotorPins = { motA: 45, motB: 13, encA: 41, encB: 42 }

const leftMotorLedc: motors.LedcConfig = { timer: 1, channelA: 0, channelB: 1 }
const rightMotorLedc: motors.LedcConfig = { timer: 1, channelA: 2, channelB: 3 }

export const LeftMot = new motors.Motor({pins:leftMotorPins, ledc:leftMotorLedc, encTicks:400, diameter:10});
export const RightMot = new motors.Motor({pins:rightMotorPins, ledc:rightMotorLedc, encTicks:400, diameter:10});

//const wheels = new motors.Wheels({ left: leftMotor, right: rightMotor, diameter: 20, width: 100 })

/*

import * as simplemotors from "./simplemotors.js"

const LMOT = new simplemotors.Motor(11, 12, 1, 2, 3);
const RMOT = new simplemotors.Motor(45, 13, 1, 4, 5);

*/

export function init() {
    adc.configure(LineSensors.S_1, adc.Attenuation.Db0);
    adc.configure(LineSensors.S_2, adc.Attenuation.Db0);
    adc.configure(LineSensors.S_3, adc.Attenuation.Db0);
    adc.configure(LineSensors.S_4, adc.Attenuation.Db0);

    gpio.pinMode(LineSensors.S_PWR, gpio.PinMode.OUTPUT);
    gpio.pinMode(LineSensors.S_SW, gpio.PinMode.OUTPUT);

    gpio.write(LineSensors.S_PWR, 1);
}



type MoveDuration = {
    distance?: number; // distance in cm
    speed?: number; // speed in mm/s?
}
/*
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
*/


export type SensorType = 'W_FR' | 'W_FL' | 'W_BL' | 'W_BR' | 'L_FR' | 'L_FL' | 'L_BL' | 'L_BR';
export class LineSensors {
    
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
        gpio.write(LineSensors.S_SW, to_value);
        await sleep(5);
    }

    public async read(sensor: SensorType): Promise<number> {
        switch (sensor) {
            case 'W_FR':
                this.switch_sensors(0);
                return adc.read(LineSensors.S_1);

            case 'W_FL':
                this.switch_sensors(0);
                return adc.read(LineSensors.S_2);

            case 'W_BL':
                this.switch_sensors(0);
                return adc.read(LineSensors.S_3);

            case 'W_BR':
                this.switch_sensors(0);
                return adc.read(LineSensors.S_4);


            case 'L_FR':
                this.switch_sensors(1);
                return adc.read(LineSensors.S_1);

            case 'L_FL':
                this.switch_sensors(1);
                return adc.read(LineSensors.S_2);

            case 'L_BL':
                this.switch_sensors(1);
                return adc.read(LineSensors.S_3);

            case 'L_BR':
                this.switch_sensors(1);
                return adc.read(LineSensors.S_4);

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

export const strip = new SmartLed(48, 9, LED_WS2812);

export class Pins {
    public static readonly Status_LED: number = 46;

    public static readonly Motor1_A = 11;
    public static readonly Motor1_B = 12;
    public static readonly Motor2_A = 45;
    public static readonly Motor2_B = 13;
    public static readonly ENC1_1 = 39;
    public static readonly ENC1_2 = 40;
    public static readonly ENC2_1 = 41;
    public static readonly ENC2_2 = 42;
}
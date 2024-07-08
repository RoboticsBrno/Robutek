
import * as adc from "adc";
import * as gpio from "gpio";

import { LED_WS2812 } from "smartled";

import * as motors from "motor"
import * as ledc from "ledc";

const robutekDiameter = 80; // mm

export class Pen {
    public static readonly Pin: number = 38;
    public static readonly Timer: number = 1;
    public static readonly Channel: number = 4;
    
    public static readonly Up: number = 512 + 180;
    public static readonly Down: number = 512 - 180;
    public static readonly Middle: number = 512;
    public static readonly Unload: number = 0;
}

export class LedStrip {
    public static readonly Count = 9;
    public static readonly Pin = 48;
    public static readonly Type = LED_WS2812;
}

export class Pins {
    public static readonly StatusLED: number = 46;

    public static readonly Motor1A: number = 11;
    public static readonly Motor1B: number = 12;
    public static readonly Motor2A: number = 45;
    public static readonly Motor2B: number = 13;
    public static readonly Enc1A: number = 39;
    public static readonly Enc1B: number = 40;
    public static readonly Enc2A: number = 42;
    public static readonly Enc2B: number = 41;
}


export type SensorType = 'W_FR' | 'W_FL' | 'W_BL' | 'W_BR' | 'L_FR' | 'L_FL' | 'L_BL' | 'L_BR';
export class LineSensors {

    public static readonly Sens_1: number = 4;
    public static readonly Sens_2: number = 5;
    public static readonly Sens_3: number = 6;
    public static readonly Sens_4: number = 7;
    public static readonly Sens_SW: number = 8;
    public static readonly Sens_EN: number = 47;

    private sw: number = 0;


    private async switch_sensors(to_value: number) {
        if (to_value == this.sw) {
            return;
        }
        this.sw = to_value;
        gpio.write(LineSensors.Sens_SW, to_value);
        await sleep(5);
    }

    public async read(sensor: SensorType): Promise<number> {
        switch (sensor) {
            case 'W_FR':
                this.switch_sensors(0);
                return adc.read(LineSensors.Sens_1);

            case 'W_FL':
                this.switch_sensors(0);
                return adc.read(LineSensors.Sens_2);

            case 'W_BL':
                this.switch_sensors(0);
                return adc.read(LineSensors.Sens_3);

            case 'W_BR':
                this.switch_sensors(0);
                return adc.read(LineSensors.Sens_4);


            case 'L_FR':
                this.switch_sensors(1);
                return adc.read(LineSensors.Sens_1);

            case 'L_FL':
                this.switch_sensors(1);
                return adc.read(LineSensors.Sens_2);

            case 'L_BL':
                this.switch_sensors(1);
                return adc.read(LineSensors.Sens_3);

            case 'L_BR':
                this.switch_sensors(1);
                return adc.read(LineSensors.Sens_4);

            default:
                return 0;

        }
    }
}

ledc.configureTimer(0, 64000, 10);

const leftMotorPins: motors.MotorPins = { motA: Pins.Motor1A, motB: Pins.Motor1B, encA: Pins.Enc1A, encB: Pins.Enc1B }
const rightMotorPins: motors.MotorPins = { motA: Pins.Motor2A, motB: Pins.Motor2B, encA: Pins.Enc2A, encB: Pins.Enc2B }

const leftMotorLedc: motors.LedcConfig = { timer: 0, channelA: 0, channelB: 1 }
const rightMotorLedc: motors.LedcConfig = { timer: 0, channelA: 2, channelB: 3 }

export const leftMot = new motors.Motor({ pins: leftMotorPins, ledc: leftMotorLedc, encTicks: 410, diameter: 34 });
export const rightMot = new motors.Motor({ pins: rightMotorPins, ledc: rightMotorLedc, encTicks: 410, diameter: 34 });


adc.configure(LineSensors.Sens_1, adc.Attenuation.Db0);
adc.configure(LineSensors.Sens_2, adc.Attenuation.Db0);
adc.configure(LineSensors.Sens_3, adc.Attenuation.Db0);
adc.configure(LineSensors.Sens_4, adc.Attenuation.Db0);

gpio.pinMode(LineSensors.Sens_EN, gpio.PinMode.OUTPUT);
gpio.write(LineSensors.Sens_EN, 1);

gpio.pinMode(LineSensors.Sens_SW, gpio.PinMode.OUTPUT);

let speed = 0;

export function setSpeed(value: number) {
    speed = value;
}

export function getSpeed() {
    return speed;
}

export type MoveDuration = { distance?: number, time?: number };

/**
 * Move the robot
 * @param curve -1 (left) to 1 (right)
 * @param duration 
 */
export async function move(curve: number, duration?: MoveDuration) {
    let lMot = 0;
    let rMot = 0;

    if (curve < 0) {
        lMot = curve+1;
        rMot = 1;
    }
    else if (curve > 0) {
        lMot = 1;
        rMot = 1-curve;
    }
    else {
        lMot = 1;
        rMot = 1;
    }

    leftMot.setSpeed(lMot*speed);
    rightMot.setSpeed(rMot*speed);

    if (duration) {
        if (duration.time) {
            await Promise.allSettled([leftMot.move({ time: duration.time*lMot }), rightMot.move({ time: duration.time*rMot })]);
        }
        else if (duration.distance) {
            await Promise.allSettled([leftMot.move({ distance: duration.distance*lMot }), rightMot.move({ distance: duration.distance*rMot })]);
        }
    }
}

/**
 * Rotate the robot
 * @param angle in degrees (optional)
 */
export async function rotate(angle?: number) {
    leftMot.setSpeed(speed);
    rightMot.setSpeed(speed);
    
    if (!angle) {
        await Promise.allSettled([leftMot.move(), rightMot.move()]);
    }
    else {
        const arcLength = (Math.abs(angle) / 360) * Math.PI * robutekDiameter;
        
        let lMot:number;
        let rMot:number;
        
        if (angle < 0) {
            lMot = -arcLength;
            rMot = arcLength;
        }
        else {
            lMot = arcLength;
            rMot = -arcLength;
        }

        await Promise.allSettled([leftMot.move({ distance: lMot }), rightMot.move({ distance: rMot })]);

    }
}

export async function stop(brake?: boolean) {
    await Promise.allSettled([leftMot.stop(brake), rightMot.stop(brake)]);
}
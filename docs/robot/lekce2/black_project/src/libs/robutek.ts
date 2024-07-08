
import * as adc from "adc";
import * as gpio from "gpio";

import { Servo } from "./servo.js";

import { SmartLed, LED_WS2812 } from "smartled";

import * as motors from "motor"

const leftMotorPins: motors.MotorPins = { motA: 11, motB: 12, encA: 39, encB: 40 }
const rightMotorPins: motors.MotorPins = { motA: 45, motB: 13, encA: 41, encB: 42 }

const leftMotorLedc: motors.LedcConfig = { timer: 1, channelA: 0, channelB: 1 }
const rightMotorLedc: motors.LedcConfig = { timer: 1, channelA: 2, channelB: 3 }

export const LeftMot = new motors.Motor({ pins: leftMotorPins, ledc: leftMotorLedc, encTicks: 400, diameter: 10 });
export const RightMot = new motors.Motor({ pins: rightMotorPins, ledc: rightMotorLedc, encTicks: 400, diameter: 10 });


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

export const ledStrip = new SmartLed(48, 9, LED_WS2812);

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
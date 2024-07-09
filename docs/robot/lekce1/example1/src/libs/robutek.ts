
import * as adc from "adc";
import * as gpio from "gpio";

import * as motor from "motor"
import * as ledc from "ledc";

const robutekDiameter = 80;  // mm
const wheelDiameter = 34;  // mm
const wheelCircumference = Math.PI * wheelDiameter;

export enum PenPos {
    Down = 512 + 180,
    Middle = 512,
    Up = 512 - 180,
    Unload = 0,
}


export enum Pins {
    StatusLED = 46,

    Motor1A = 11,
    Motor1B = 12,
    Motor2A = 45,
    Motor2B = 13,
    Enc1A = 39,
    Enc1B = 40,
    Enc2A = 42,
    Enc2B = 41,

    Sens1 = 4,
    Sens2 = 5,
    Sens3 = 6,
    Sens4 = 7,

    SensSW = 8,
    SensEN = 47,
}

let sw: number = 0;
async function switchSensors(toValue: number) {
    if (toValue == sw) {
        return;
    }
    sw = toValue;
    gpio.write(Pins.SensSW, toValue);
    await sleep(1);
}

export type SensorType = 'WheelFR' | 'WheelFL' | 'WheelBL' | 'WheelBR' | 'LineFR' | 'LineFL' | 'LineBL' | 'LineBR';
export async function readSensor(sensor: SensorType): Promise<number> {
    switch (sensor) {
        case 'WheelFR':
            await switchSensors(0);
            return adc.read(Pins.Sens1);
        case 'WheelFL':
            await switchSensors(0);
            return adc.read(Pins.Sens2);
        case 'WheelBL':
            await switchSensors(0);
            return adc.read(Pins.Sens3);
        case 'WheelBR':
            await switchSensors(0);
            return adc.read(Pins.Sens4);
        case 'LineFR':
            await switchSensors(1);
            return adc.read(Pins.Sens1);
        case 'LineFL':
            await switchSensors(1);
            return adc.read(Pins.Sens2);
        case 'LineBL':
            await switchSensors(1);
            return adc.read(Pins.Sens3);
        case 'LineBR':
            await switchSensors(1);
            return adc.read(Pins.Sens4);
        default:
            throw new Error('Invalid sensor type');
    }
}

ledc.configureTimer(0, 64000, 10);

const leftMotorPins: motor.MotorPins = { motA: Pins.Motor1A, motB: Pins.Motor1B, encA: Pins.Enc1A, encB: Pins.Enc1B };
const rightMotorPins: motor.MotorPins = { motA: Pins.Motor2A, motB: Pins.Motor2B, encA: Pins.Enc2A, encB: Pins.Enc2B };

const leftMotorLedc: motor.LedcConfig = { timer: 0, channelA: 0, channelB: 1 };
const rightMotorLedc: motor.LedcConfig = { timer: 0, channelA: 2, channelB: 3 };

export const leftMotor = new motor.Motor({ pins: leftMotorPins, ledc: leftMotorLedc, encTicks: 410, circumference: wheelCircumference });
export const rightMotor = new motor.Motor({ pins: rightMotorPins, ledc: rightMotorLedc, encTicks: 410, circumference: wheelCircumference });


adc.configure(Pins.Sens1, adc.Attenuation.Db0);
adc.configure(Pins.Sens2, adc.Attenuation.Db0);
adc.configure(Pins.Sens3, adc.Attenuation.Db0);
adc.configure(Pins.Sens4, adc.Attenuation.Db0);

gpio.pinMode(Pins.SensEN, gpio.PinMode.OUTPUT);
gpio.write(Pins.SensEN, 1);

gpio.pinMode(Pins.SensSW, gpio.PinMode.OUTPUT);

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
        lMot = curve + 1;
        rMot = 1;
    }
    else if (curve > 0) {
        lMot = 1;
        rMot = 1 - curve;
    }
    else {
        lMot = 1;
        rMot = 1;
    }

    leftMotor.setSpeed(lMot*speed);
    rightMotor.setSpeed(rMot*speed);

    if (duration) {
        if (duration.time) {
            await Promise.all([
                leftMotor.move({ time: duration.time*lMot }),
                rightMotor.move({ time: duration.time*rMot })
            ]);
        }
        else if (duration.distance) {
            await Promise.all([
                leftMotor.move({ distance: duration.distance*lMot }),
                rightMotor.move({ distance: duration.distance*rMot })
            ]);
        }
    }
}

/**
 * Rotate the robot
 * @param angle in degrees (optional)
 */
export async function rotate(angle?: number) {
    leftMotor.setSpeed(speed);
    rightMotor.setSpeed(speed);

    if (!angle) {
        await Promise.all([
            leftMotor.move(),
            rightMotor.move()
        ]);
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

        await Promise.all([
            leftMotor.move({ distance: lMot }),
            rightMotor.move({ distance: rMot })
        ]);
    }
}

export async function stop(brake?: boolean) {
    await Promise.all([
        leftMotor.stop(brake),
        rightMotor.stop(brake)
    ]);
}

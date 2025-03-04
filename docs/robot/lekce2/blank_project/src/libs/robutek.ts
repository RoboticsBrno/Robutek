
import * as adc from "adc";
import * as gpio from "gpio";

import * as motor from "motor"
import * as ledc from "ledc";

const robutekDiameter = 83;  // mm
const wheelDiameter = 33.3;  // mm
const wheelCircumference = Math.PI * wheelDiameter;

export enum PenPos {
    Down = 512+50,
    Up = 512 - 180,
    Unload = 150,
}


export enum Pins {
    StatusLED = 46,

    // Jedna na desce a zároveň vývod pro pásek,
    // po připojení externího pásku se tedy jedná
    // o 8 + 1 = 9 diod celkem
    ILED = 48,

    ButtonLeft =  2,
    ButtonRight = 0,

    Servo1 = 21,
    Servo2 = 38,

    Sens1 = 4,
    Sens2 = 5,
    Sens3 = 6,
    Sens4 = 7,

    SensSW = 8,
    SensEN = 47,

    Motor1A = 11,
    Motor1B = 12,
    Motor2A = 45,
    Motor2B = 13,
    Enc1A = 39,
    Enc1B = 40,
    Enc2A = 42,
    Enc2B = 41,
}

let sw: number = 0;
function switchSensors(toValue: number) {
    if (toValue == sw) {
        return;
    }
    sw = toValue;
    gpio.write(Pins.SensSW, toValue);

    // don't do this at home
    const start = Date.now();
    while (Date.now() - start < 2);
}

export const enum SensorType {
    WheelFR = 'WheelFR', // Wheel Front Right
    WheelFL = 'WheelFL', // Wheel Front Left ...
    WheelBL = 'WheelBL',
    WheelBR = 'WheelBR',
    LineFR = 'LineFR',
    LineFL = 'LineFL',
    LineBL = 'LineBL',
    LineBR = 'LineBR',
}

export function readSensor(sensor: SensorType | `${SensorType}`): number {
    switch (sensor) {
        case SensorType.WheelFR:
            switchSensors(0);
            return adc.read(Pins.Sens1);
        case SensorType.WheelFL:
            switchSensors(0);
            return adc.read(Pins.Sens2);
        case SensorType.WheelBL:
            switchSensors(0);
            return adc.read(Pins.Sens3);
        case SensorType.WheelBR:
            switchSensors(0);
            return adc.read(Pins.Sens4);
        case SensorType.LineFR:
            switchSensors(1);
            return adc.read(Pins.Sens1);
        case SensorType.LineFL:
            switchSensors(1);
            return adc.read(Pins.Sens2);
        case SensorType.LineBL:
            switchSensors(1);
            return adc.read(Pins.Sens3);
        case SensorType.LineBR:
            switchSensors(1);
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

const reg: motor.RegParams = {
    kp: 7000,
    ki: 350,
    kd: 350,
    kv: 166,
    ka: 11000,
    kc: 72,
    maxIOut: 1023,
    unwindFactor: 1
};

export const leftMotor = new motor.Motor({ pins: leftMotorPins, ledc: leftMotorLedc, encTicks: 812, reg, circumference: wheelCircumference });
export const rightMotor = new motor.Motor({ pins: rightMotorPins, ledc: rightMotorLedc, encTicks: 812, reg, circumference: wheelCircumference });


adc.configure(Pins.Sens1, adc.Attenuation.Db0);
adc.configure(Pins.Sens2, adc.Attenuation.Db0);
adc.configure(Pins.Sens3, adc.Attenuation.Db0);
adc.configure(Pins.Sens4, adc.Attenuation.Db0);

gpio.pinMode(Pins.SensEN, gpio.PinMode.OUTPUT);
gpio.write(Pins.SensEN, 1);

gpio.pinMode(Pins.SensSW, gpio.PinMode.OUTPUT);

let speed = 0;
let ramp = 0;

export function setSpeed(value: number) {
    speed = value;
}

export function setRamp(value: number) {
    ramp = value;
}

export function getSpeed() {
    return speed;
}

export function getRamp() {
    return ramp;
}

/**
 * Move the robot
 * @param curve number in range -1 to 1, where -1 is full left, 0 is straight and 1 is full right
 * @param duration optional duration of the move
 */
export async function move(curve: number, duration?: motor.MoveDuration) {
    let lMot = 0;
    let rMot = 0;

    if (curve < 0) {
        lMot = 1 + curve * 2;
        rMot = 1;
    }
    else if (curve > 0) {
        lMot = 1;
        rMot = 1 - curve * 2;
    }
    else {
        lMot = 1;
        rMot = 1;
    }

    leftMotor.setSpeed(lMot * speed);
    rightMotor.setSpeed(rMot * speed);
    leftMotor.setRamp(lMot * ramp);
    rightMotor.setRamp(rMot * ramp);

    const hasTime = duration && duration.hasOwnProperty("time");
    const hasDistance = duration && duration.hasOwnProperty("distance");

    if (duration && (hasTime || hasDistance)) {
        if (hasTime) {
            await Promise.all([
                leftMotor.move(duration),
                rightMotor.move(duration)
            ]);
        }
        else if (hasDistance) {
            const distance = (duration as { distance: number }).distance;
            await Promise.all([
                leftMotor.move({ distance: distance * lMot }),
                rightMotor.move({ distance: distance * rMot })
            ]);
        }
    } else {
        await Promise.all([
            leftMotor.move(),
            rightMotor.move()
        ]);
    }
}

/**
 * Rotate the robot
 * @param angle in degrees
 */
export async function rotate(angle: number) {
    leftMotor.setSpeed(speed);
    rightMotor.setSpeed(speed);
    leftMotor.setRamp(ramp);
    rightMotor.setRamp(ramp);

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

/**
 * Stop the robot
 * @param brake if true, the robot will brake, otherwise it will coast to a stop
 */
export async function stop(brake?: boolean) {
    await Promise.all([
        leftMotor.stop(brake),
        rightMotor.stop(brake)
    ]);
}

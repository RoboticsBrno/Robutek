
import * as adc from "adc";
import * as gpio from "gpio";
import * as motor from "motor"
import * as ledc from "ledc";
import { DifferentialDrive } from "./differentialDrive.js";

const robutekDiameter = 83;  // mm
const wheelDiameter = 33.3;  // mm
const wheelCircumference = Math.PI * wheelDiameter;


enum PinsV1 {
    StatusLED = 46,

    // The first LED of the strip is on the board, the LED strip
    // connected to the ILED connector has indexes offset by 1.
    ILED = 48,

    ButtonLeft =  2,
    ButtonRight = 0,

    Servo1 = 21,
    Servo2 = 38,

    Sens1 = 5,
    Sens2 = 4,
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

enum PinsV2 {
    StatusLED = 46,

    ILED = 48,
    ILEDConnector = 36,

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
    Enc1A = 40,
    Enc1B = 39,
    Enc2A = 41,
    Enc2B = 42,

    SDA = 10,
    SCL = 3
}


const RegV1: motor.RegParams = {
    kp: 7000,
    ki: 350,
    kd: 350,
    kv: 166,
    ka: 11000,
    kc: 72,
    maxIOut: 1023,
    unwindFactor: 1
};

const RegV2: motor.RegParams = {
    kp: 7000,
    ki: 350,
    kd: 400,
    kv: 166,
    ka: 16000,
    kc: 72,
    maxIOut: 1023,
    unwindFactor: 1
};


type RobutekLedcConfig = {
    timer: number;
    channels: [number, number, number, number];
};


const EncoderTicksV1 = 812;
const EncoderTicksV2 = 560;

export type SensorType =
    | 'WheelFL' // Wheel Front Left ...
    | 'WheelFR' // Wheel Front Right
    | 'WheelBL'
    | 'WheelBR'
    | 'LineFL'
    | 'LineFR'
    | 'LineBL'
    | 'LineBR';

export class Robutek<PinsType extends typeof PinsV1 | typeof PinsV2> extends DifferentialDrive {
    public readonly Pins: PinsType;
    private ledcConfig: RobutekLedcConfig;

    readonly PenPos = {
        Down: 512+50,
        Up: 512 - 180,
        Unload: 150,
    }

    constructor(pins: PinsType, encTicks: number, reg: motor.RegParams, ledcConfig: RobutekLedcConfig) {
        ledc.configureTimer(ledcConfig.timer, 20000, 10);

        const leftMotorPins: motor.MotorPins = { motA: pins.Motor1A, motB: pins.Motor1B, encA: pins.Enc1A, encB: pins.Enc1B };
        const rightMotorPins: motor.MotorPins = { motA: pins.Motor2A, motB: pins.Motor2B, encA: pins.Enc2A, encB: pins.Enc2B };

        const leftMotorLedc: motor.LedcConfig = { timer: ledcConfig.timer, channelA: ledcConfig.channels[0], channelB: ledcConfig.channels[1] };
        const rightMotorLedc: motor.LedcConfig = { timer: ledcConfig.timer, channelA: ledcConfig.channels[2], channelB: ledcConfig.channels[3] };

        const leftMotor = new motor.Motor({ pins: leftMotorPins, ledc: leftMotorLedc, encTicks: encTicks, reg, circumference: wheelCircumference });
        const rightMotor = new motor.Motor({ pins: rightMotorPins, ledc: rightMotorLedc, encTicks: encTicks, reg, circumference: wheelCircumference });

        super(leftMotor, rightMotor, robutekDiameter);
        this.stop();

        adc.configure(pins.Sens1, adc.Attenuation.Db0);
        adc.configure(pins.Sens2, adc.Attenuation.Db0);
        adc.configure(pins.Sens3, adc.Attenuation.Db0);
        adc.configure(pins.Sens4, adc.Attenuation.Db0);

        gpio.pinMode(pins.SensEN, gpio.PinMode.OUTPUT);
        gpio.write(pins.SensEN, 1);

        gpio.pinMode(pins.SensSW, gpio.PinMode.OUTPUT);

        this.Pins = pins;
    }

    private sw: number = 0;
    public switchSensors(toValue: number) {
        if (toValue == this.sw) {
            return;
        }
        this.sw = toValue;
        gpio.write(this.Pins.SensSW, toValue);

        // don't do this at home
        const start = Date.now();
        while (Date.now() - start < 2);
    }

    public readSensor(sensor: SensorType): number {
        switch (sensor) {
            case 'WheelFL':
                this.switchSensors(0);
                return adc.read(this.Pins.Sens1);
            case 'WheelFR':
                this.switchSensors(0);
                return adc.read(this.Pins.Sens2);
            case 'WheelBL':
                this.switchSensors(0);
                return adc.read(this.Pins.Sens3);
            case 'WheelBR':
                this.switchSensors(0);
                return adc.read(this.Pins.Sens4);
            case 'LineFL':
                this.switchSensors(1);
                return adc.read(this.Pins.Sens1);
            case 'LineFR':
                this.switchSensors(1);
                return adc.read(this.Pins.Sens2);
            case 'LineBL':
                this.switchSensors(1);
                return adc.read(this.Pins.Sens3);
            case 'LineBR':
                this.switchSensors(1);
                return adc.read(this.Pins.Sens4);
            default:
                throw new Error('Invalid sensor type');
        }
    }

    public close() {
        this.leftMotor.close();
        this.rightMotor.close();
        gpio.pinMode(this.Pins.SensEN, gpio.PinMode.DISABLE);
        gpio.pinMode(this.Pins.SensSW, gpio.PinMode.DISABLE);
        ledc.stopTimer(this.ledcConfig.timer);
    }
}


export const defaultLedcConfig: RobutekLedcConfig = {
    timer: 0,
    channels: [0, 1, 2, 3]
};


export function createRobutek(version: "V1", ledcConfig?: RobutekLedcConfig): Robutek<typeof PinsV1>;
export function createRobutek(version: "V2", ledcConfig?: RobutekLedcConfig): Robutek<typeof PinsV2>;
export function createRobutek(version: "V1" | "V2", ledcConfig: RobutekLedcConfig = defaultLedcConfig): Robutek<typeof PinsV1 | typeof PinsV2> {
    if (version === "V1") {
        return new Robutek(PinsV1, EncoderTicksV1, RegV1, ledcConfig) as Robutek<typeof PinsV1>;
    }
    else {
        return new Robutek(PinsV2, EncoderTicksV2 ,RegV2, ledcConfig) as Robutek<typeof PinsV2>;
    }
}

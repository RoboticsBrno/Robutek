import * as adc from "adc";
import * as gpio from "gpio";
import * as motor from "motor";
import * as ledc from "ledc";
import { DifferentialDrive } from "./differentialDrive.js";
const robutekDiameter = 83; // mm
const wheelDiameter = 33.3; // mm
const wheelCircumference = Math.PI * wheelDiameter;
var PinsV1;
(function (PinsV1) {
    PinsV1[PinsV1["StatusLED"] = 46] = "StatusLED";
    // The first LED of the strip is on the board, the LED strip
    // connected to the ILED connector has indexes offset by 1.
    PinsV1[PinsV1["ILED"] = 48] = "ILED";
    PinsV1[PinsV1["ButtonLeft"] = 2] = "ButtonLeft";
    PinsV1[PinsV1["ButtonRight"] = 0] = "ButtonRight";
    PinsV1[PinsV1["Servo1"] = 21] = "Servo1";
    PinsV1[PinsV1["Servo2"] = 38] = "Servo2";
    PinsV1[PinsV1["Sens1"] = 5] = "Sens1";
    PinsV1[PinsV1["Sens2"] = 4] = "Sens2";
    PinsV1[PinsV1["Sens3"] = 6] = "Sens3";
    PinsV1[PinsV1["Sens4"] = 7] = "Sens4";
    PinsV1[PinsV1["SensSW"] = 8] = "SensSW";
    PinsV1[PinsV1["SensEN"] = 47] = "SensEN";
    PinsV1[PinsV1["Motor1A"] = 11] = "Motor1A";
    PinsV1[PinsV1["Motor1B"] = 12] = "Motor1B";
    PinsV1[PinsV1["Motor2A"] = 45] = "Motor2A";
    PinsV1[PinsV1["Motor2B"] = 13] = "Motor2B";
    PinsV1[PinsV1["Enc1A"] = 39] = "Enc1A";
    PinsV1[PinsV1["Enc1B"] = 40] = "Enc1B";
    PinsV1[PinsV1["Enc2A"] = 42] = "Enc2A";
    PinsV1[PinsV1["Enc2B"] = 41] = "Enc2B";
})(PinsV1 || (PinsV1 = {}));
var PinsV2;
(function (PinsV2) {
    PinsV2[PinsV2["StatusLED"] = 46] = "StatusLED";
    PinsV2[PinsV2["ILED"] = 48] = "ILED";
    PinsV2[PinsV2["ILEDConnector"] = 36] = "ILEDConnector";
    PinsV2[PinsV2["ButtonLeft"] = 2] = "ButtonLeft";
    PinsV2[PinsV2["ButtonRight"] = 0] = "ButtonRight";
    PinsV2[PinsV2["Servo1"] = 21] = "Servo1";
    PinsV2[PinsV2["Servo2"] = 38] = "Servo2";
    PinsV2[PinsV2["Sens1"] = 4] = "Sens1";
    PinsV2[PinsV2["Sens2"] = 5] = "Sens2";
    PinsV2[PinsV2["Sens3"] = 6] = "Sens3";
    PinsV2[PinsV2["Sens4"] = 7] = "Sens4";
    PinsV2[PinsV2["SensSW"] = 8] = "SensSW";
    PinsV2[PinsV2["SensEN"] = 47] = "SensEN";
    PinsV2[PinsV2["Motor1A"] = 11] = "Motor1A";
    PinsV2[PinsV2["Motor1B"] = 12] = "Motor1B";
    PinsV2[PinsV2["Motor2A"] = 45] = "Motor2A";
    PinsV2[PinsV2["Motor2B"] = 13] = "Motor2B";
    PinsV2[PinsV2["Enc1A"] = 40] = "Enc1A";
    PinsV2[PinsV2["Enc1B"] = 39] = "Enc1B";
    PinsV2[PinsV2["Enc2A"] = 41] = "Enc2A";
    PinsV2[PinsV2["Enc2B"] = 42] = "Enc2B";
    PinsV2[PinsV2["SDA"] = 10] = "SDA";
    PinsV2[PinsV2["SCL"] = 3] = "SCL";
})(PinsV2 || (PinsV2 = {}));
const RegV1 = {
    kp: 7000,
    ki: 350,
    kd: 350,
    kv: 166,
    ka: 11000,
    kc: 72,
    maxIOut: 1023,
    unwindFactor: 1
};
const RegV2 = {
    kp: 7000,
    ki: 350,
    kd: 400,
    kv: 166,
    ka: 16000,
    kc: 72,
    maxIOut: 1023,
    unwindFactor: 1
};
const EncoderTicksV1 = 812;
const EncoderTicksV2 = 560;
export class Robutek extends DifferentialDrive {
    Pins;
    ledcConfig;
    PenPos = {
        Down: 512 + 50,
        Up: 512 - 180,
        Unload: 150,
    };
    constructor(pins, encTicks, reg, ledcConfig) {
        ledc.configureTimer(ledcConfig.timer, 20000, 10);
        const leftMotorPins = { motA: pins.Motor1A, motB: pins.Motor1B, encA: pins.Enc1A, encB: pins.Enc1B };
        const rightMotorPins = { motA: pins.Motor2A, motB: pins.Motor2B, encA: pins.Enc2A, encB: pins.Enc2B };
        const leftMotorLedc = { timer: ledcConfig.timer, channelA: ledcConfig.channels[0], channelB: ledcConfig.channels[1] };
        const rightMotorLedc = { timer: ledcConfig.timer, channelA: ledcConfig.channels[2], channelB: ledcConfig.channels[3] };
        const leftMotor = new motor.Motor({ pins: leftMotorPins, ledc: leftMotorLedc, encTicks: encTicks, reg, circumference: wheelCircumference });
        const rightMotor = new motor.Motor({ pins: rightMotorPins, ledc: rightMotorLedc, encTicks: encTicks, reg, circumference: wheelCircumference });
        super(leftMotor, rightMotor, robutekDiameter);
        adc.configure(pins.Sens1, adc.Attenuation.Db0);
        adc.configure(pins.Sens2, adc.Attenuation.Db0);
        adc.configure(pins.Sens3, adc.Attenuation.Db0);
        adc.configure(pins.Sens4, adc.Attenuation.Db0);
        gpio.pinMode(pins.SensEN, gpio.PinMode.OUTPUT);
        gpio.write(pins.SensEN, 1);
        gpio.pinMode(pins.SensSW, gpio.PinMode.OUTPUT);
        this.Pins = pins;
    }
    sw = 0;
    switchSensors(toValue) {
        if (toValue == this.sw) {
            return;
        }
        this.sw = toValue;
        gpio.write(this.Pins.SensSW, toValue);
        // don't do this at home
        const start = Date.now();
        while (Date.now() - start < 2)
            ;
    }
    readSensor(sensor) {
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
    close() {
        this.leftMotor.close();
        this.rightMotor.close();
        gpio.pinMode(this.Pins.SensEN, gpio.PinMode.DISABLE);
        gpio.pinMode(this.Pins.SensSW, gpio.PinMode.DISABLE);
        ledc.stopTimer(this.ledcConfig.timer);
    }
}
export const defaultLedcConfig = {
    timer: 0,
    channels: [0, 1, 2, 3]
};
export function createRobutek(version, ledcConfig = defaultLedcConfig) {
    if (version === "V1") {
        return new Robutek(PinsV1, EncoderTicksV1, RegV1, ledcConfig);
    }
    else {
        return new Robutek(PinsV2, EncoderTicksV2, RegV2, ledcConfig);
    }
}

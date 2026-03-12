import { I2C } from "i2c";

/* Copyright (c) 2017 Gordon Williams, Pur3 Ltd. See the file LICENSE for copying permission. */
// modified from Espruino's VL53L0X module (https://www.espruino.com/VL53L0X)
const C = {
    REG_SYSRANGE_START: 0,
    REG_RESULT_RANGE_STATUS: 0x0014
};

export type Measurement = {
    distance: number,
    signalRate: number,
    ambientRate: number,
    effectiveSpadRtnCount: number
};

export class VL53L0X {

    private i2c: I2C;
    private ad: number;
    private StopVariable: number;

    constructor(i2c: I2C) {
        this.i2c = i2c;
        this.ad = 0x52 >> 1;
        this.init();
    }

    /**
     * Set a new I2C address for the sensor.
     * @note Config is not persistant through power cycle.
     * @param newAddress The new I2C address to set.
     */
    public setAddress(newAddress: number) {
        this.w(0x8A, newAddress & 0x7F);
        this.ad = newAddress;
    }

    /** initialise VL53L0X */
    private init() {
        this.w(0x80, 0x01);
        this.w(0xFF, 0x01);
        this.w(0x00, 0x00);
        this.StopVariable = this.r(0x91, 1)[0];
        this.w(0x00, 0x01);
        this.w(0xFF, 0x00);
        this.w(0x80, 0x00);
    }

    private r(addr: number, n: number): Uint8Array {
        this.i2c.writeTo(this.ad, addr);
        return this.i2c.readFrom(this.ad, n);
    }
    private w(addr: number, d: number) {
        this.i2c.writeTo(this.ad, [addr, d]);
    }

    /**
     * Perform one measurement and return the result.
     * Returns an object of the form:
     * {
     *   distance , // distance in mm
     *   signalRate, // target reflectance
     *   ambientRate, // ambient light.
     *   effectiveSpadRtnCount //  effective SPAD count for the return signal
     * }
     */
    async read(): Promise<Measurement> {
        // start measurement
        this.w(0x80, 0x01);
        this.w(0xFF, 0x01);
        this.w(0x00, 0x00);
        this.w(0x91, this.StopVariable);
        this.w(0x00, 0x01);
        this.w(0xFF, 0x00);
        this.w(0x80, 0x00);
        // VL53L0X_DEVICEMODE_SINGLE_RANGING:
        this.w(C.REG_SYSRANGE_START, 0x01);
        // wait for it to finish
        while (!(this.r(C.REG_RESULT_RANGE_STATUS, 1)[0] & 1)) {
            await sleep(1);
        }
        // read and format data
        var d = new DataView(this.r(0x14, 12).buffer);
        var res = {
            distance: d.getUint16(10),
            signalRate: d.getUint16(6) / 128,
            ambientRate: d.getUint16(8) / 128,
            effectiveSpadRtnCount: d.getUint16(2) / 256
        };
        // TODO: use LinearityCorrectiveGain/etc
        return res;
    }
}

export function connect(i2c: I2C) {
    return new VL53L0X(i2c);
};

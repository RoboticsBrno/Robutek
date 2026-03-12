import * as i2c from 'i2c';

const ADDRESS = 0x6A;

export function initI2C(bus: i2c.I2C, scl: number, sda: number) {
    bus.setup({ scl: scl, sda: sda });
}

export function setBit(bus: i2c.I2C, address: number, reg: number, bit: number, value: boolean) {
    bus.writeTo(address, reg);
    let data = bus.readFrom(address, 1)[0];
    data = value ? data | (1 << bit) : data & ~(1 << bit);
    bus.writeTo(address, [ reg, data ]);
}

export function startADCContinous(bus: i2c.I2C) {
    setBit(bus, ADDRESS, 2, 6, true);
}

export function startADCOneshot(bus: i2c.I2C) {
    setBit(bus, ADDRESS, 2, 7, true);
}

export function readADC(bus: i2c.I2C) {
    bus.writeTo(ADDRESS, 0x0F);
    let value = bus.readFrom(ADDRESS, 1)[0];
    return (value * 20 + 2304) / 1000;
}

export function resetWatchdog(bus: i2c.I2C) {
    setBit(bus, ADDRESS, 3, 6, true);
}

export async function readADCOneshot(bus: i2c.I2C) {
    startADCOneshot(bus);
    await sleep(50);
    return readADC(bus);
}

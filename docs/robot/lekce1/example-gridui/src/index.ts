import * as robutek from "./libs/robutek.js"
import * as wifi from "wifi";
import { SmartLed, LED_WS2812 } from "smartled"
import Layout from "./layout.js"


// Změň mě!
const OWNER = "owner";
const DEVICE_NAME = "Robutek";


const ledStrip = new SmartLed(48, 1, LED_WS2812);

let stopTimeout = null;

function stop() {
    robutek.leftMotor.setSpeed(0);
    robutek.rightMotor.setSpeed(0);
    stopTimeout = null;
}

function scale(value: number): number {
    // Scale the joystick value from -32768..32767 to -1..1
    return value / 32768;
}

function setMotorsJoystick(x: number, y: number, coef = 2.5) {
    // Scale the joystick values
    x = scale(x);
    y = scale(y);

    // Calculate motor powers
    let r = (y - (x / coef));
    let l = (y + (x / coef));

    // Apply speed limiter
    r = r * speedLimiter;
    l = l * speedLimiter;

    // Swap r and l if both are negative
    if (r < 0 && l < 0) {
        [r, l] = [l, r];
    }

    console.log(`x: ${x}, y: ${y}`);
    console.log(`left motor power: ${l}, right motor power: ${r}`);

    // Set motor power
    robutek.leftMotor.setSpeed(l * speedMul);
    robutek.rightMotor.setSpeed(r * speedMul);

    // Stop robot on connection loss
    if (stopTimeout !== null) {
        clearTimeout(stopTimeout);
    }
    stopTimeout = setTimeout(stop, 1000);
}

Layout.begin(OWNER, DEVICE_NAME, builder => {

    builder.ButtonBlink.onPress(async () => {
        ledStrip.clear();
        ledStrip.set(0, { r: 255, g: 0, b: 0 });
        ledStrip.show();
        await sleep(500);
        ledStrip.clear();
        ledStrip.show();
    });

    builder.SetSpeed.onChanged(slider => {
        speedLimiter = slider.value;
        console.log(`speed limiter: ${speedLimiter}`);
    });

    builder.Joystick.onPositionChanged(joystick => {
        setMotorsJoystick(joystick.x, joystick.y);
    });

});

let speedLimiter = 0.5
let speedMul = 500;

robutek.leftMotor.move();
robutek.rightMotor.move();

console.log("Otevři aplikaci RBController nebo otevři prohlížeč a zadej IP: " + wifi.currentIp() + " pro ovládání robota.");
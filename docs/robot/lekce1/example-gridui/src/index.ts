import * as Robutek from "./libs/robutek.js"
import * as wifi from "wifi";
import {SmartLed, LED_WS2812} from "smartled"
import Layout from "./layout.js"

const ledStrip = new SmartLed(Robutek.LedStrip.Pin, Robutek.LedStrip.Count, Robutek.LedStrip.Type);

function scale(value) {
  // Scale the joystick value from -32768..32767 to -1..1
  return value / 32768;
}

function limitSpeed(value, factor) {
  // Apply a limiting factor to the value
  return value * factor;
}

function setMotorsJoystick(x: number, y: number, coef = 2.5) {
  // Scale the joystick values
  x = scale(x);
  y = scale(y);

  // Calculate motor powers
  let r = (y - (x / coef));
  let l = (y + (x / coef));

  // Apply speed limiter
  r = limitSpeed(r, speedLimiter);
  l = limitSpeed(l, speedLimiter);

  // Ensure the values are within the range -1 to 1
  r = Math.max(-1, Math.min(1, r));
  l = Math.max(-1, Math.min(1, l));

  // Swap r and l if both are negative
  if (r < 0 && l < 0) {
    [r, l] = [l, r];
  }

  console.log(`x: ${x}, y: ${y}`);
  console.log(`left motor power: ${l}, right motor power: ${r}`);

  // Set motor power
  Robutek.leftMot.setSpeed(l);
  Robutek.leftMot.move();
  Robutek.rightMot.setSpeed(r);
  Robutek.rightMot.move();
}


let speedLimiter = 0.5;

Layout.begin("Owner name", "Device Name", builder => {

  builder.ButtonBlink.onPress(async () => {
    ledStrip.clear();
    ledStrip.set(0, { r: 255, g: 0, b: 0 });
    ledStrip.show();
    await sleep(500);
    ledStrip.clear();
    ledStrip.set(0, { r: 0, g: 255, b: 0 });
    ledStrip.show();
    await sleep(500);
  });

  builder.SetSpeed.onChanged(slider => {
    speedLimiter = slider.value;
    console.log(`speed limiter: ${speedLimiter}`);
  });

  builder.Joystick.onPositionChanged(joystick => {
    setMotorsJoystick(joystick.x, joystick.y);
  });

})

console.log("Otevři aplikaci RBController nebo otevři prohlížeč a zadej IP: " + wifi.currentIp() + " pro ovládání robota.");
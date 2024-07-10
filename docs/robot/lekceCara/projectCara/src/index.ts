import * as robutek from "./libs/robutek.js";
import * as gpio from "gpio";
import { Pins } from "./libs/robutek.js";
import { SensorType } from "./libs/robutek.js";

// Sledujeme teď čáru?
let following = false;

// Byla čára naposled pod levým senzorem?
let previousLeft = false;

// Zapínací tlačítko
gpio.pinMode(Pins.ButtonLeft, gpio.PinMode.INPUT);
gpio.on("rising", Pins.ButtonLeft, async () => {
  if (!following) {
    // Pokud ještě nesledujeme čáru...
    await sleep(500); // počkáme 500ms ať stihneš dát pryč ruku
    robutek.leftMotor.move();
    robutek.rightMotor.move();
    following = true; // přepneme proměnnou se stavem, aby hlavní smyčka začala fungovat.
  } else {
    // Pokud ji sledujeme, tak naopak zastavíme
    robutek.leftMotor.stop();
    robutek.rightMotor.stop();
    following = false;
  }
});

// Hlavní smyčka
async function main() {
  while (true) {
    if (!following) {
      // Pokud nesledujeme čáru, nedělěj nic
      await sleep(100);
      continue;
    }

    // Vyčti hodnotu ze senzorů
    const l = robutek.readSensor(SensorType.WheelFL);
    const r = robutek.readSensor(SensorType.WheelFR);

    console.log(`l: ${l}, r: ${r}`);

    const threshold = 100; // Pod tímto číslem se považuje senzor na čáře
    if (l < threshold) {
      // Čára je pod levým senzorem, doprava!
      robutek.leftMotor.setSpeed(10);
      robutek.rightMotor.setSpeed(100);
      previousLeft = true;
    } else if (r < threshold) {
      // Čára je pod pravým senzorem, doleva!
      robutek.leftMotor.setSpeed(100);
      robutek.rightMotor.setSpeed(10);
      previousLeft = false;
    } else {
      robutek.leftMotor.setSpeed(100);
      robutek.rightMotor.setSpeed(100);
    }

    // Krátký sleep, který nechá běžet zbytek Robůtka
    await sleep(1);
  }
}

main().catch(console.error);

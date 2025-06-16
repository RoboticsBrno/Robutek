import * as gpio from "gpio";
import { SmartLed, LED_WS2812 } from "smartled";
import * as colors from "./libs/colors.js"
import * as adc from "adc";
import * as ledc from "ledc";
import { Servo } from "./libs/servo.js"

const SW_0 = 18;
const SW_1 = 16;
const SW_2 = 42;

const LED_G = 17;
const LED_Y = 15;
const LED_R = 45;
const LED_B = 46;

const POT_0 = 2
const POT_1 = 1

const PIEZO_PIN = 0;
const PIEZO_PIN_ENABLE = 3;

const SMART_LED_PIN_ESP = 48
const SMART_LED_PIN_EX = 21;
const SMART_LED_PIN_EX_COUNT = 8;

const JOY_PM12_X = 9;
const JOY_PM12_Y = 10;

const JOY_PM2_X = 6;
const JOY_PM2_Y = 4;

const SERVO_PIN_1 = 40;
const SERVO_PIN_0 = 35;

function configureButtons() {
	let btns = [SW_0, SW_1, SW_2];
	for (let i = 0; i < btns.length; i++) {
		gpio.pinMode(btns[i], gpio.PinMode.INPUT);
	}

	let leds = [LED_G, LED_Y, LED_R, LED_B, PIEZO_PIN_ENABLE];
	for (let i = 0; i < leds.length; i++) {
		gpio.pinMode(leds[i], gpio.PinMode.OUTPUT);
	}

	gpio.on("falling", SW_0, () => {
		gpio.write(LED_G, 1);
		console.log("SW_0");
	});

	gpio.on("falling", SW_1, () => {
		gpio.write(LED_Y, 1);
		console.log("SW_1");
	});

	gpio.on("falling", SW_2, () => {
		gpio.write(LED_R, 1);
		gpio.write(LED_B, 1);
		console.log("SW_2");
	});

	gpio.on("rising", SW_0, () => {
		gpio.write(LED_G, 0);
	});

	gpio.on("rising", SW_1, () => {
		gpio.write(LED_Y, 0);
	});

	gpio.on("rising", SW_2, () => {
		gpio.write(LED_R, 0);
		gpio.write(LED_B, 0);
	});
}

function configurePotentiometers() {

	adc.configure(POT_1);
	adc.configure(POT_0);

	let pot = [0, 0];
	setInterval(() => {
		let potNew = [0, 0];
		potNew[0] = adc.read(POT_0);
		potNew[1] = adc.read(POT_1);
		if (Math.abs(potNew[0] - pot[0]) > 10) {
			console.log("POT_0: " + potNew[0]);
			pot[0] = potNew[0];
		}
		if (Math.abs(potNew[1] - pot[1]) > 10) {
			console.log("POT_1: " + potNew[1]);
			pot[1] = potNew[1];
		}
	}, 100);
}

function configurePiezo() {
	ledc.configureTimer(0, 1000);
	ledc.configureChannel(0, PIEZO_PIN, 0, 512);

	let frequency = 1000;
	let step = 10;

	gpio.write(PIEZO_PIN_ENABLE, 1);

	setInterval(() => {
		if (gpio.read(SW_0) == 0) {
			ledc.setDuty(0, 512);
			frequency += step;
			if (frequency >= 2000) {
				frequency = 2000;
				step *= -1;
			}
			if (frequency <= 1000) {
				frequency = 1000;
				step *= -1;
			}
			ledc.setFrequency(0, frequency);
		} else {
			ledc.setDuty(0, 0);
		}
	}, 10);
}

function configureLedStripEsp() {
	let ledStrip = new SmartLed(SMART_LED_PIN_ESP, 1, LED_WS2812);
	ledStrip.clear();
	ledStrip.show();
	let color = 0;
	setInterval(() => {
		let brightness = adc.read(POT_0) / 1023;

		ledStrip.set(0, colors.rainbow(color % 360, brightness));
		ledStrip.show();
		color++;
	}, 10);
}

function mapADC(rangeFrom: number, rangeTo: number, num: number): number {
    let result: number = (num / (rangeFrom / rangeTo));
    return Math.round(result);
}

function configureLedStripExternal() {
	adc.configure(JOY_PM12_X);
	adc.configure(JOY_PM12_Y);

	let ledStrip = new SmartLed(SMART_LED_PIN_EX, SMART_LED_PIN_EX_COUNT, LED_WS2812);

	setInterval(() => {
		const lenght = mapADC(1023, 7, adc.read(JOY_PM12_X)); // nastaví délku na hodnotu z potenciometru (0-7)
		const ledColor = mapADC(1023, 360, adc.read(JOY_PM12_Y)); // nastaví barvu na hodnotu z potenciometru (0-360)
		const brightness = adc.read(POT_1) / 1023; // nastaví jas na hodnotu z potenciometru (0-1)
		ledStrip.clear(); // vymaže pásek
		for (let i: number = 0; i <= lenght; i++) { // nastavíme barvu na všechny ledky v rozsahu délky
			ledStrip.set(i, colors.rainbow(ledColor, brightness));
		}
		ledStrip.show();
	}, 10);
}

function configureServo() {
	adc.configure(JOY_PM2_X);
	adc.configure(JOY_PM2_Y);

	let servo0 = new Servo(SERVO_PIN_0, 1, 4);
	let servo1 = new Servo(SERVO_PIN_1, 1, 5);

	let joy = [0, 0];
	setInterval(() => {
		let joyNew = [0, 0];
		joyNew[0] = adc.read(JOY_PM2_X);
		joyNew[1] = adc.read(JOY_PM2_Y);
		// console.log(`JOY_PM2_X: ${joyNew[0]} JOY_PM2_Y: ${joyNew[1]}`);

		if (Math.abs(joyNew[0] - joy[0]) > 10) {
			console.log("JOY_PM2_X: " + joyNew[0]);
			joy[0] = joyNew[0];
			servo0.write(joy[0]);

		}
		if (Math.abs(joyNew[1] - joy[1]) > 10) {
			console.log("JOY_PM2_Y: " + joyNew[1]);
			joy[1] = joyNew[1];
			servo1.write(joy[1]);
		}
	}, 100);
}

configureButtons();
configurePiezo();
configurePotentiometers();
configureLedStripEsp();
configureLedStripExternal();
configureServo();

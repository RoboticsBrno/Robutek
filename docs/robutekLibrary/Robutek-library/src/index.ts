import { stdin } from "stdio";
import * as gpio from "gpio";
import * as colors from "./libs/colors.js"




import * as Robot from "./libs/robot.js"

Robot.init()

const pen = new Robot.Pen(38);

const sensors = new Robot.Sensors();

const strip = new Robot.Strip();

Robot.Pins.ENC1_1
Robot.Pins.M1_1
Robot.Pins.Status_LED

strip.set(0, colors.rainbow(123, 5));
strip.fill({ r: 0, g: 0, b: 0 });
strip.clear();
strip.show();


pen.move(Robot.Pen.UP);
pen.move(Robot.Pen.DOWN);
pen.move(Robot.Pen.MIDDLE);
pen.move(Robot.Pen.UNLOAD);
// pen.move(angle); 


sensors.read('W_FR').then(console.log)
// await sensors.read('W_FR') 

/*
 * Naming:
 * WFR = Wheel Front Right (in front of right wheel)
 * LBL = Line Back Left (next to pen)
 */

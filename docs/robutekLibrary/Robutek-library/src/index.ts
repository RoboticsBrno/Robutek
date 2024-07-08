import * as Robot from "./libs/robot.js"

Robot.init()

const strip = new Robot.Strip();
strip.clear();
strip.set(0, { r: 255, g: 0, b: 0 });
strip.show();

console.log("Robotický tábor 2024")

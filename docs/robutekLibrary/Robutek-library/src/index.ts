import * as Robot from "./libs/robot.js"

Robot.init()

Robot.strip.clear();
Robot.strip.set(0, { r: 255, g: 0, b: 0 });
Robot.strip.show();

/*
async function main() {
    await Robot.RightMot.move({time:Infinity})
    console.log("move");
}
main();

setInterval(() => {
    console.log(Robot.RightMot.getPosition());
},   100);
*/

console.log("Robotický tábor 2024")

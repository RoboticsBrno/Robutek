const PI_180 = 180 / Math.PI;
export class DifferentialDrive {
    speed = 0;
    ramp = 0;
    diameter;
    leftMotor;
    rightMotor;
    constructor(leftMotor, rightMotor, diameter) {
        this.leftMotor = leftMotor;
        this.rightMotor = rightMotor;
        this.diameter = diameter;
    }
    setSpeed(value) {
        this.speed = value;
    }
    setRamp(value) {
        this.ramp = value;
    }
    getSpeed() {
        return this.speed;
    }
    getRamp() {
        return this.ramp;
    }
    /**
     * Move the robot
     * @param curve number in range -1 to 1, where -1 is full left, 0 is straight and 1 is full right
     * @param duration optional duration of the move
     */
    async move(curve, duration) {
        let lMot = 0;
        let rMot = 0;
        if (curve < 0) {
            lMot = 1 + curve * 2;
            rMot = 1;
        }
        else if (curve > 0) {
            lMot = 1;
            rMot = 1 - curve * 2;
        }
        else {
            lMot = 1;
            rMot = 1;
        }
        this.leftMotor.setSpeed(lMot * this.speed);
        this.rightMotor.setSpeed(rMot * this.speed);
        this.leftMotor.setRamp(lMot * this.ramp);
        this.rightMotor.setRamp(rMot * this.ramp);
        const hasTime = duration && duration.hasOwnProperty("time");
        const hasDistance = duration && duration.hasOwnProperty("distance");
        if (duration && (hasTime || hasDistance)) {
            if (hasTime) {
                await Promise.all([
                    this.leftMotor.move(duration),
                    this.rightMotor.move(duration)
                ]);
            }
            else if (hasDistance) {
                const distance = duration.distance;
                await Promise.all([
                    this.leftMotor.move({ distance: distance * lMot }),
                    this.rightMotor.move({ distance: distance * rMot })
                ]);
            }
        }
        else {
            await Promise.all([
                this.leftMotor.move(),
                this.rightMotor.move()
            ]);
        }
    }
    /**
     * Rotate the robot
     * @param angle in degrees
     */
    async rotate(angle) {
        this.leftMotor.setSpeed(this.speed);
        this.rightMotor.setSpeed(this.speed);
        this.leftMotor.setRamp(this.ramp);
        this.rightMotor.setRamp(this.ramp);
        const arcLength = (Math.abs(angle) / 360) * Math.PI * this.diameter;
        let lMot;
        let rMot;
        if (angle < 0) {
            lMot = -arcLength;
            rMot = arcLength;
        }
        else {
            lMot = arcLength;
            rMot = -arcLength;
        }
        await Promise.all([
            this.leftMotor.move({ distance: lMot }),
            this.rightMotor.move({ distance: rMot })
        ]);
    }
    headingOffset = 0;
    getHeadingRaw() {
        const difference = this.leftMotor.getPosition() - this.rightMotor.getPosition();
        const heading = (difference / this.diameter) * PI_180;
        return Math.round(heading);
    }
    /**
     * Get the current heading of the robot, measured from start
     * @returns heading in degrees
     */
    getHeading() {
        return this.getHeadingRaw() + this.headingOffset;
    }
    /**
     * Get the current heading of the robot, clamped to 0-360 degrees
     * @returns heading in degrees, always in range 0-360
     */
    getHeadingClamped() {
        const heading = this.getHeading() % 360;
        return heading < 0 ? heading + 360 : heading;
    }
    /**
     * Reset the heading of the robot to 0 degrees
     */
    resetHeading() {
        this.headingOffset = -this.getHeadingRaw();
    }
    /**
     * Stop the robot
     * @param brake if true, the robot will brake, otherwise it will coast to a stop
     */
    async stop(brake) {
        await Promise.all([
            this.leftMotor.stop(brake),
            this.rightMotor.stop(brake)
        ]);
    }
}
;

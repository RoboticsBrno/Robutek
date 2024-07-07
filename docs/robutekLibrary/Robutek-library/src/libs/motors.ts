declare module "motors" {

    type MoveDuration = {
        distance?: number; // distance in cm - negative = reverse
        speed?: number; // speed in mm/s?
    }

    type RotateDuration = {
        angle?: number; // angle in degrees
        speed?: number; // speed in mm/s?
    }

    type MotorConf = {
        pos: number;
        neg: number;
        encA: number;
        encB: number;
        encTicks: number;
        reverse?: boolean;
    };

    class Motor {
        constructor(options: { pins: MotorConf, diameter: number });
        setPower(power: number): void;
        setRamp(ramp: number): void;

        move(duration?: MoveDuration): Promise<void>;
        stop(brq?: boolean): Promise<void>;
        getPosition(): number;
    }

    class Wheels {
        constructor(options: { left: MotorConf, right: MotorConf, diameter: number, width: number });
        setPower(power: number): void;
        setRamp(ramp: number): void;

        move(curve: number, duration?: MoveDuration): Promise<void>;
        rotate(angle: number): Promise<void>;
        stop(brq?: boolean): Promise<void>;
        getPosition(): { left: number, right: number };
    }
}
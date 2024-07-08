import * as ledc from "ledc";

/**
 * A class for controlling a servo motor.
 */
export class Motor {
    private channel1: number; // the PWM channel to use
    private channel2: number; // the PWM channel to use

    /**
     * Create a new servo object.
     * @param pin1 The pin the servo is connected to.
     * @param pin2 The pin the servo is connected to.
     * @param timer The timer to use for PWM.
     * @param channel1 The channel to use for PWM.
     * @param channel2 The channel to use for PWM.
     */

    constructor(pin1: number, pin2: number, timer: number, channel1: number, channel2: number) {
        this.channel1 = channel1;
        this.channel2 = channel2;
        ledc.configureTimer(timer, 50, 12); // 50Hz is the frequency of a servo, 12 is the resolution of the timer
        ledc.configureChannel(channel1, pin1, timer, 1023); // 1023 is the resolution of a servo
        ledc.configureChannel(channel2, pin2, timer, 1023); // 1023 is the resolution of a servo
    }

    /**
     * Set the servo position.
     * @param value The position to set the servo to, from -1 to 1.
     */
    write(value: number) {
        console.log(value)

        if (value > 0) {
            ledc.setDuty(this.channel1, 1);
            ledc.setDuty(this.channel2, (Math.abs(value) * 1023));
        }
        else if (value < 0) {
            ledc.setDuty(this.channel1, (Math.abs(value) * 1023));
            ledc.setDuty(this.channel2, 1);
        }
        else {
            ledc.setDuty(this.channel1, 1);
            ledc.setDuty(this.channel2, 1);
        }
    }
}

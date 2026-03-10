---
title: Robutek
---

# Welcome to the Robutek project page

## Quick links

1. [Introduction](#introduction)
2. [Assembly guide](robotAssembly/stage1.md)
3. [Hardware reference](hardware/index.md)
4. [Programming lessons](robot/index.md)

## Introduction

!!! note "This documentation is for Robutek V2."
    Looking for **V1**?
    You can find it [here](https://robutek.robotikabrno.cz/v1/).

Robutek is a robotics platform intended for teaching programming and robotics, while also serving as an extensible platform for building your own robots with minimal entry requirements.

Out of the box, Robutek can:

- drive,
- draw with a pen,
- follow a line,
- move through a maze,
- connect additional sensors

You can also join our [Discord server](https://discord.gg/wqhsRXPUzD), where we are happy to help with Robutek-related questions.

---

## Capabilities

### Motion and sensing

- **Differential drive**
- **Wheel encoders** for precise motion
- **IR sensors** for line following

### Color and light

- **RGB sensor** in the chassis for floor color detection
- **RGB lighting** on the robot

### Drawing

- **Pen holder** for drawing on paper
- **Servo** on the expansion deck for **lifting the pen**

### Expansion deck

- **Addressable RGB LED strip**
- **Laser distance sensor (VL53L0X)**
- **Additional RGB sensor**

---

## Getting started

1. **Assemble the hardware** using the [assembly guide](robotAssembly/stage1.md).
2. **Prepare the Jaculus environment** by following the [setup lesson](robot/lekce0/index.md).
3. **Upload a base project** using the reference **Robutek library** as a starting point.
4. **Try the sensors and motion** by reading encoders, line sensors, and the RGB sensor.
5. **Try drawing** by inserting the pen and using the servo to lift and lower it.

!!! tip "Library quick start"
    The `robutekLibrary` folder serves as a **reference project** for other projects in the documentation.

---

## Documentation

### Architecture overview

- **Controller:** ESP32-S3
- **Drive:** differential drive with **2 motors** and **wheel encoders**
- **Sensors:** IR line sensors, bottom RGB sensor, **VL53L0X** distance sensor, additional RGB sensor on the deck
- **Lighting:** addressable RGB LED strip and RGB chassis lighting
- **Drawing:** servo-controlled pen mechanism
- **Programming:** **Jaculus** (see the [official site](https://jaculus.org/getting-started/))

### Hardware reference

If you are looking for hardware information without depending on any specific programming language, use the new [**Hardware**](hardware/index.md) section.
It contains:

- pinout and connector overview,
- built-in sensor descriptions,
- motor, servo, and LED documentation,
- overview of external modules on `I2C` and other interfaces.

---

## Programming lessons

The programming lessons were created for [Robot Camp 2025](https://robotickytabor.cz/) as guided teaching material.
They were intended for work with an instructor and are not ideal as standalone study material.
You can find them in the [**Programming lessons**](robot/index.md) section.

---

## Safety and recommendations

- Before drawing, check that the pen is properly secured and the work surface is suitable.
- When working with power and motors, pay attention to correct polarity and solid mechanical mounting.
- When using the **VL53L0X** distance sensor, avoid staring into the emitter from very close range.

---

## Version history

| Year | Version | Description |
| --- | --- | --- |
| 2024 | v1 | First full Robutek version |
| 2025 | v2 | Board fixes, RGB sensor, improved motor precision |

### What's new in V2

- Integrated **RGB sensor** for floor color detection.
- **RGB lighting** for appearance and visual signaling.
- **Simpler assembly** thanks to integrated encoders.

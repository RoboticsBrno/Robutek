// AUTOGENERATED FILE, DO NOT EDIT
// Generated by https://gridui.robotikabrno.cz/
// Layout: {"cols":12,"rows":18,"enableSplitting":true,"widgets":[{"uuid":43594,"type":"Button","state":{"id":"ButtonBlink","x":1,"y":1.5,"w":10,"h":2,"tab":0,"css":{},"text":"Blikni","fontSize":18,"color":"#fb0404","background":"","align":"center","valign":"center","disabled":false}},{"uuid":11866,"type":"Joystick","state":{"id":"Joystick","x":3,"y":10,"w":6,"h":5.5,"tab":0,"css":{},"color":"#FF0000","keys":"","text":""}},{"uuid":4862,"type":"Slider","state":{"id":"SetSpeed","x":1,"y":4,"w":10,"h":2.5,"tab":0,"css":{},"color":"#008000","fontSize":16,"min":0,"max":1,"value":0.5,"precision":0.05,"showValue":true}},{"uuid":47586,"type":"Text","state":{"id":"TextSpeed","x":1,"y":6.5,"w":10,"h":1,"tab":0,"css":{},"text":"Nastavení maximální rychlosti","fontSize":17,"color":"#000000","background":"","align":"center","valign":"center","prefix":"","suffix":""}},{"uuid":26977,"type":"Text","state":{"id":"TextInfo","x":1,"y":0,"w":10,"h":1,"tab":0,"css":{},"text":"Řízení Robůtka","fontSize":19,"color":"#000000","background":"","align":"center","valign":"center","prefix":"","suffix":""}}]}

// Add this as a file layout.ts to your project.
//
// Inicialization:
//
//   import Layout from "./layout.js"
//
//   Layout.begin("Owner name", "Device Name", builder => {
//
//     // Add calback handlers here, like this:
//     builder.Button1.onPress(btn => {
//         console.log("press")
//     })
//
//   })
//
// Usage later in code:
//
//   Layout.Button1.color = "red";
//   console.log(Layout.Button1.pressed)
//

import * as gridui from "gridui"

if (gridui.version() < 0x040000) {
    throw new Error("Your RBGridUi library version is too low for this layout, please update to 040000.")
}

interface LayoutBuilder {
    readonly ButtonBlink: gridui.builder.Button
    readonly Joystick: gridui.builder.Joystick
    readonly SetSpeed: gridui.builder.Slider
    readonly TextSpeed: gridui.builder.Text
    readonly TextInfo: gridui.builder.Text
}

interface Layout {
    readonly ButtonBlink: gridui.widget.Button
    readonly Joystick: gridui.widget.Joystick
    readonly SetSpeed: gridui.widget.Slider
    readonly TextSpeed: gridui.widget.Text
    readonly TextInfo: gridui.widget.Text

    begin(ownerName: string, deviceName: string, builderCallback?: (layoutBuilder: LayoutBuilder) => void): void

    changeTab(index: number): void
    log(message: string): void
}

const layout = {
    begin(ownerName: string, deviceName: string, builderCallback?: (layoutBuilder: LayoutBuilder) => void) {
        gridui.begin(ownerName, deviceName, (builder) => {
            const layoutBuilder: LayoutBuilder = {
                ButtonBlink: builder.button(1, 1.5, 10, 2, 43594)
                    .text("Blikni")
                    .fontSize(18)
                    .color("#fb0404"),
                Joystick: builder.joystick(3, 10, 6, 5.5, 11866),
                SetSpeed: builder.slider(1, 4, 10, 2.5, 4862)
                    .max(1)
                    .value(0.5)
                    .precision(0.05),
                TextSpeed: builder.text(1, 6.5, 10, 1, 47586)
                    .text("Nastavení maximální rychlosti")
                    .fontSize(17),
                TextInfo: builder.text(1, 0, 10, 1, 26977)
                    .text("Řízení Robůtka")
                    .fontSize(19)
            }

            if (builderCallback !== undefined) {
                builderCallback(layoutBuilder)
            }

            for (const key in layoutBuilder) {
                layout[key] = layoutBuilder[key].finish()
                layoutBuilder[key] = undefined
            }
        })
    },
    changeTab: gridui.changeTab,
    log: gridui.log,
} as Layout

export default layout
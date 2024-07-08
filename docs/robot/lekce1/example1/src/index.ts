import { LED_WS2812, SmartLed } from "smartled"

const ledStrip = new SmartLed(48, 1, LED_WS2812);

ledStrip.clear(); // Zhasne LEDku na Robůtkovi, jenom pro jistotu, kdyby už předtím svítila
ledStrip.set(0, { r: 255, g: 0, b: 0 }); // Nastaví první LEDku na červenou barvu, LEDky začínají na indexu 0
ledStrip.show(); // Rozsvítí LEDku s červenou, kterou jsme si nastavili

setInterval(() => { // pravidelně vyvolává událost
  console.log("Robotický tábor 2024, zdraví Jirka Vácha!"); // vypíše text: Robotický tábor 2024, zdraví Jirka Vácha!
}, 1000); // čas opakování se udává v milisekundách (1000 ms je 1 sekunda)
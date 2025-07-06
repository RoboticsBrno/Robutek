# Lekce 9 - Radio

Na Robůtkovi je k dispozici jednoduchá bezdrátová komunikace na vzdálenost jednotek metrů.

- Až 16 "skupin", všechny desky ve stejné skupině přijmají zprávy od všech ostatních zároveň
- Podporuje tři datové typy:

      - **Řetězce** do délky 30 znaků
      - **Čísla**
      - **Klíč - hodnota**, kdy klíč je řetězec do 22 znaků a hodnota je číslo

## Spuštění

Pokud chcete používat radio, je třeba importovat jeho knihovnu a poté zavolat `#!ts begin(<číslo skupiny>);`

```ts
import * as radio from "simpleradio";

// zapnutí radia, 4 je číslo skupiny. Může být od 0 do 15 včetně.
radio.begin(4);

// vypnutí radia
radio.end();
```

## Odesílání dat

K odesílání slouží 3 `send` funkce:

```ts
// Odeslání řetezce
radio.sendString("Ahoj!");

let hodnota = 22;
radio.sendString(`Hodnota: ${hodnota}`); // s formátováním
```

```ts
// Odeslání čísla
radio.sendNumber(42);
radio.sendNumber(-2.42);
```

```ts
// Odeslání klíč - hodnota
radio.sendKeyValue("rychlost", 10);
```

### Rychlé odesílání

Pokud se rychle za sebou pokusíte odeslat dvě různé hodnoty, je možné, že dorazí pouze jedna - je třeba počkat před odesláním další hodnoty:

```ts
async function main() {
  while (true) {
    radio.sendKeyValue("x", 10);
    await sleep(50); // čekání, aby se hodnota X stihla odeslat
    radio.sendKeyValue("y", 20);

    await sleep(1000);
  }
}
main();
```

## Přijmání dat

Pro přijmání dat slouží funkce `#!ts on`. První parametr callbacku je vždy přijatá hodnota, druhá je objekt s informacemi o přijmu - od koho (`address`) a s jaku sílou signálu (`rssi`) data přišla.

```ts
// řetězce
radio.on("string", (retezec, info) => {
  console.log(
    `Přijal jsem řetězec '${retezec}'.
    Od: ${info.address},
    síla signálu: ${info.rssi})
`
  );
});
```

```ts
// číslo
radio.on("number", (cislo, info) => {
  console.log(
    `Přijal jsem číslo ${cislo}.
    Od: ${info.address},
    síla signálu: ${info.rssi})
`
  );
});
```

```ts
// klíč - hodnota
radio.on("keyvalue", (klic, hodnota, info) => {
  console.log(
    `Přijal jsem ${klic} = ${hodnota}.
    Od: ${info.address},
    síla signálu: ${info.rssi})
`
  );
});
```

Každou kategorii přijmacího callbacku lze i zrušit:

```ts
radio.off("string");
radio.off("number");
radio.off("keyvalue");
```

## Zadání A

Vytvořte program, který pomocí klíč-hodnota bude přes rádio odesílat stav dvou tlačítek na desce
(stisknuto == `1`, nestisknuto == `0`).
Zároveň bude reagovat na příchozí hodnoty a rosvicovat první 2 LED na LED pásku podle příchozího stavu.

Jako klíče použijte `IO0` a `IO2`. Vždy, když přijde klíč `IO0` s hodnotou 1, rozsvítíte LED na indexu 1, a když 0, tak ji zhasnete,
a stejně tak pro další tlačítko a LED.

Najděte kamaráda, abyste si mohli navzájem zkusit, zda program funguje (jeden vysílá, druhý přijmá).

??? note "Řešení"
    ```ts
    import * as radio from "simpleradio";
    import * as gpio from "gpio";
    import { SmartLed, LED_WS2812B } from "smartled";
    import * as colors from "./libs/colors.js";
    import { createRobutek } from "./libs/robutek.js"
    const robutek = createRobutek("V2");

    radio.begin(5); // skupina 5

    const LED_COUNT = 3;

    // Nastavíme tlačítka jako vstupy
    gpio.pinMode(robutek.Pins.ButtonLeft, gpio.PinMode.INPUT);
    gpio.pinMode(robutek.Pins.ButtonRight, gpio.PinMode.INPUT);

    gpio.on("falling", PIN_BTN_LEFT, () => {
        // Při stisknutí tlačítka 0
        radio.sendKeyValue("IO2", 1); // odešleme hodnotu 1 s klíčem IO2
    });
    gpio.on("rising", PIN_BTN_LEFT, () => {
        // Při uvolnění tlačítka 0
        radio.sendKeyValue("IO2", 0); // odešleme hodnotu 0 s klíčem IO2
    });

    gpio.on("falling", PIN_BTN_RIGHT, () => {
        radio.sendKeyValue("IO0", 1); // odešleme hodnotu 1 s klíčem IO0
    });
    gpio.on("rising", PIN_BTN_RIGHT, () => {
        radio.sendKeyValue("IO0", 0); // odešleme hodnotu 0 s klíčem IO0
    });

    // Nastavíme LED piny jako výstupy
    const strip = new SmartLed(robutek.Pins.ILED, LED_COUNT);

    // Zpracování příchozích správ
    radio.on("keyvalue", (klic, hodnota, info) => {
        if (klic === "IO0") {
            strip.set(1, colors.rainbow(0, hodnota * 10))
        } else if (klic === "IO2") {
            strip.set(2, colors.rainbow(150, hodnota * 10))
        }

        strip.show();
    });
    ```

## Výchozí úkol V1

Změňtě program ze zadání A tak, aby místo tlačítek vyčítal ADC převodník. Na LED pásku se bude zobrazovat hondota z ADC.

# Lekce 9 - radio

Na ELKS je k dispozici jednoduchá bezdrátová komunikace na vzdálenost jednotek metrů.

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

Vytvořte program, který pomocí klíč-hodnota bude přes rádio odesílat stav tří tlačítek na desce
(stisknuto == `1`, nestisknuto == `0`).
Zároveň bude reagovat na příchozí hodnoty a rosvicovat první 3 LED na desce podle příchozího stavu.

Jako klíče použijte `sw0`, `sw1` a `sw2`. Vždy, když přijde klíč `sw0` s hodnotou 1, rozsvítíte LED-G, a když 0, tak ji zhasnete,
a stejně tak pro další dvě tlačítka a LED.

Najděte kamaráda, abyste si mohli navzájem zkusit, zda program funguje (jeden vysílá, druhý přijmá).

??? note "Řešení"
    ```ts
    import * as radio from "simpleradio";
    import * as gpio from "gpio";

    radio.begin(5); // skupina 5

    const PIN_SW0 = 18;
    const PIN_SW1 = 16;
    const PIN_SW2 = 42;

    const PIN_LED0 = 17;
    const PIN_LED1 = 15;
    const PIN_LED2 = 45;

    // Nastavíme tlačítka jako vstupy
    gpio.pinMode(PIN_SW0, gpio.PinMode.INPUT);
    gpio.pinMode(PIN_SW1, gpio.PinMode.INPUT);
    gpio.pinMode(PIN_SW2, gpio.PinMode.INPUT);

    gpio.on("falling", PIN_SW0, () => {
      // Při stisknutí tlačítka 0
      radio.sendKeyValue("sw0", 1); // odešleme hodnotu 1 s klíčem sw0
    });
    gpio.on("rising", PIN_SW0, () => {
      // Při uvolnění tlačítka 0
      radio.sendKeyValue("sw0", 0); // odešleme hodnotu 0 s klíčem sw0
    });

    gpio.on("falling", PIN_SW1, () => {
      radio.sendKeyValue("sw1", 1);
    });
    gpio.on("rising", PIN_SW1, () => {
      radio.sendKeyValue("sw1", 0);
    });

    gpio.on("falling", PIN_SW2, () => {
      radio.sendKeyValue("sw2", 1);
    });
    gpio.on("rising", PIN_SW2, () => {
      radio.sendKeyValue("sw2", 0);
    });



    // Nastavíme LED piny jako výstupy
    gpio.pinMode(PIN_LED0, gpio.PinMode.OUTPUT);
    gpio.pinMode(PIN_LED1, gpio.PinMode.OUTPUT);
    gpio.pinMode(PIN_LED2, gpio.PinMode.OUTPUT);

    // Zpracování příchozích správ
    radio.on("keyvalue", (klic, hodnota, info) => {
      if (klic === "sw0") {
        gpio.write(PIN_LED0, hodnota);
      } else if (klic === "sw1") {
        gpio.write(PIN_LED1, hodnota);
      } else if (klic === "sw2") {
        gpio.write(PIN_LED2, hodnota);
      }
    });
    ```

## Výchozí úkol V1

Změňtě program ze zadání A tak, aby místo tlačítek vyčítal potenciometr, a místo ledek rozsvicoval LED pásek. Je na vás, zda vzládnete rozsvicovat a pohybovat duhou, nebo pouze jednou z LED podle toho, jak se natočí potenciometr na vysílači.

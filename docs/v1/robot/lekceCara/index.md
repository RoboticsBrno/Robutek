# Lekce 8 - sledování čáry

Po seznámení s Robůtkem a programovacím prostředí se můžeme pustit do prvního projektu. Naším cílem bude vytvořit robota, který bude následovat černou čáru nakreslenou na bílém podkladu.

K vyřešení tohoto úkolu budeme používat senzory odrazu světla, které jsou umístěné na spodní straně Robůtka. Tyto senzory dokáží rozpoznat, zda se pod nimi nachází bílá nebo černá plocha, případně jakou část pozorované plochy tvoří čára.

Začneme opět s prázdným projektem, stáhni/nakopíruj si ho do nové složky pro tuto lekci:
[Stáhnout ZIP s prázdným projektem](../lekce2/blank_project.zip){ .md-button .md-button--primary }


## Startování na tlačítko
Aby se nám program lépe startoval, přidáme "statovou proměnou", kam si uložíme, jestli robot zrovna sleduje čáru.

Tuto proměnou nastavíme na `true` nebo `false` po stisku tlačítka. Zároveň pustíme nebo zastavíme motory.

Tentokrát přistupujeme k pravému a levému motoru napřímo, abychom je mohli řídit více precizně.

```ts
// Sledujeme teď čáru?
let following = false;

// Zapínací tlačítko
gpio.pinMode(Pins.ButtonLeft, gpio.PinMode.INPUT);
gpio.on("rising", Pins.ButtonLeft, async () => {
  if (!following) {
    // Pokud ještě nesledujeme čáru...
    await sleep(500); // počkáme 500ms ať stihneš dát pryč ruku
    robutek.leftMotor.move();
    robutek.rightMotor.move();
    following = true; // přepneme proměnnou se stavem, aby hlavní smyčka začala fungovat.
  } else {
    // Pokud ji sledujeme, tak naopak zastavíme
    robutek.leftMotor.stop();
    robutek.rightMotor.stop();
    following = false;
  }
});
```

Tento kód by měl po stisknutí levého tlačítka roztočit motory a na další stisk je zase zastavit.

## Hlavní smyčka

Opět použijeme `async function main()` jako hlavní smyčku:

Tentokrát přibude kontrola, zda jsme ve "sledovacím režimu", `if(!following)`. V takovém přípdě pouze na chvíli počkáme, a jinak přeskočíme na další iteraci (`continue`).

Na konci smyčky ve sledovacím režimu ještě patří krátký `await sleep(1)`, aby kromě sledování čáry mohl běžet i zbytek programu na Robůtkovi.

```ts
async function main() {
  while (true) {

    if (!following) {
      // Pokud nesledujeme čáru, nedělěj nic
      await sleep(100);
      continue;
    }

    // <--- Tady budeme řídit robota podle čáry

    // Krátký sleep, který nechá běžet zbytek Robůtka
    await sleep(1);
  }
}

main().catch(console.error);
```

## Čtení senzorů

Robůtek má na sobě zespodu senzory odrazivosti povrchu. Zde je jejich pojmenování:

![](assets/senzory.jpg)

V tomto programu budeme číst senzory `WheelFR` a `WheelFL`. Nebojte se program upravovat a zkusit jiné senzory!

Samotné čtení probíhá pomocí funkce `robutek.readSensor(JMENO_SENZORU)`. Vrácí číslo od 0 do ~150, kdy 0 je nejnižší odrazivost (černá)
a 150 je nejvyšší (bílá).

```ts
    // Vyčti hodnotu ze senzorů
    const l = robutek.readSensor("WheelFL");
    const r = robutek.readSensor("WheelFR");

    console.log(`l: ${l}, r: ${r}`);
```

!!! tip "Všimni si vypisování hodnot ze senzorů do konzole - tak si můžeš zjistit, co tvůj Robůtek doopravdy vidí!"

## Ovládání motorů

Dále musíme podle hodnot ze senzorů ovládat motory. Použijeme jednoduchou sadu podmínek, kdy podle toho, pod kterým senzorem vidíme
čáru, budeme zatáčet.

* Když je čára po levým senzorem, tak musíme doprava,
* když je pod pravým, tak musíme doleva,
* a když není pod žádným, můžeme rovně

```ts
    const threshold = 50; // Pod tímto číslem se považuje senzor na čáře
    if (l < threshold) {
      // Čára je pod levým senzorem, doprava!
      robutek.leftMotor.setSpeed(10);
      robutek.rightMotor.setSpeed(100);
    } else if (r < threshold) {
      // Čára je pod pravým senzorem, doleva!
      robutek.leftMotor.setSpeed(100);
      robutek.rightMotor.setSpeed(10);
    } else {
      robutek.leftMotor.setSpeed(100);
      robutek.rightMotor.setSpeed(100);
    }
```

## Vylepšení
A to je vše! S tímto kódem zvládne sledovat čáru...ale ne moc rychle. **Zkuste ho vylepšit!**

* Zvýšit rychlost?
* Upravit `threshold`?
* Použít více senzorů, než jen dva?


## Celý kód
Pro úplnost je zde celý kód:

```ts
import * as robutek from "./libs/robutek.js";
import * as gpio from "gpio";
import { Pins } from "./libs/robutek.js";

// Sledujeme teď čáru?
let following = false;

// Zapínací tlačítko
gpio.pinMode(Pins.ButtonLeft, gpio.PinMode.INPUT);
gpio.on("rising", Pins.ButtonLeft, async () => {
  if (!following) {
    // Pokud ještě nesledujeme čáru...
    await sleep(500); // počkáme 500ms ať stihneš dát pryč ruku
    robutek.leftMotor.move();
    robutek.rightMotor.move();
    following = true; // přepneme proměnnou se stavem, aby hlavní smyčka začala fungovat.
  } else {
    // Pokud ji sledujeme, tak naopak zastavíme
    robutek.leftMotor.stop();
    robutek.rightMotor.stop();
    following = false;
  }
});

// Hlavní smyčka
async function main() {
  while (true) {
    if (!following) {
      // Pokud nesledujeme čáru, nedělěj nic
      await sleep(100);
      continue;
    }

    // Vyčti hodnotu ze senzorů
    const l = robutek.readSensor("WheelFL");
    const r = robutek.readSensor("WheelFR");

    console.log(`l: ${l}, r: ${r}`);

    const threshold = 50; // Pod tímto číslem se považuje senzor na čáře
    if (l < threshold) {
      // Čára je pod levým senzorem, doprava!
      robutek.leftMotor.setSpeed(10);
      robutek.rightMotor.setSpeed(100);
    } else if (r < threshold) {
      // Čára je pod pravým senzorem, doleva!
      robutek.leftMotor.setSpeed(100);
      robutek.rightMotor.setSpeed(10);
    } else {
      robutek.leftMotor.setSpeed(100);
      robutek.rightMotor.setSpeed(100);
    }

    // Krátký sleep, který nechá běžet zbytek Robůtka
    await sleep(1);
  }
}

main().catch(console.error);
```

# Sledování čáry

Po seznámení s Robůtkem a programovacím prostředí se můžeme pustit do prvního projektu. Naším cílem bude vytvořit robota, který bude následovat černou čáru nakreslenou na bílém podkladu.

K vyřešení tohoto úkolu budeme používat senzory odrazu světla, které jsou umístěné na spodní straně Robůtka. Tyto senzory dokáží rozpoznat, zda se pod nimi nachází bílá nebo černá plocha, případně jakou část pozorované plochy tvoří čára.

=== "Odkaz"
    ```
    https://robutek.robotikabrno.cz/v2/robot/blank_project.tar.gz
    ```
=== "Zip"
    [Stáhnout ZIP](../../robot/blank_project.zip){ .md-button .md-button--primary }


## Čtení ze senzorů

Na spodní straně Robůtka se nachází 8 senzorů odrazu světla. Tyto senzory umožňují rozpoznávat, jak tmavá nebo světlá je plocha pod Robůtkem. Senzory indikují odrazivost povrchu pomocí napětí, které Robůtek měří a převádí na číslo. Čím vyšší je pak naměřená hodnota, tím světlejší povrch je. Aby naměřená hodnota byla co nejpřesnější, senzory si přisvětlují plochu pomocí infračerveného světla.

Senzory jsou uspořádány do dvou sad po čtyřech senzorech (A1, A2, A3, A4 a B1, B2, B3, B4), mezi kterými se přepíná podle toho, který senzor v danou chvíli chceme použít. Přepínání mezi sadami je řízeno pomocí pinu `IO8` a logická hodnota 1 aktivuje sadu A, zatímco logická hodnota 0 aktivuje sadu B. Přepínání mezi sadami senzorů trvá krátký okamžit, během kterého mohou senzory měřit špatné hodnoty. Je tedy potřeba alespoň 1 ms počkat, než začneme číst hodnoty senzorů.

Přisvětlení senzorů je potřeba zapnout samostatně pomocí pinu `IO47`. Pokud je tento pin nastaven na logickou hodnotu 1, senzory si přisvětlují plochu, pokud je nastaven na logickou hodnotu 0, senzory si nepřisvětlují plochu.

Protože je senzorů hodně a je potřeba je nastavovat a přepínat, v knihovně `robutek.js` jsme nachystali několik funkcí, které používání senzorů usnadňují.

## Import knihovny

Nejprve si musíme knihovnu importovat. To uděláme pomocí příkazu `import`:

```ts
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V2");
```

## Dostupné rozhraní

Při importu knihovny se senzory správně nastaví a připraví k použití. K jejich následnému ovládání nám už stačí pouze dvě funkce:

- `readSensor(sensor: SensorPos): number` - vrátí naměřenou hodnotu senzoru. Parametr `sensor` je typ senzoru, který chceme číst. Dostupné senzory jsou popsány v `enum robutek.SensorPos`. Tato funkce sama přepíná mezi sadami senzorů.

## Příklad použití

Nyní si ukážeme, jak můžeme číst hodnoty senzorů. Nejprve si musíme importovat knihovnu a poté můžeme začít s čtením hodnot senzorů.

```ts
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V2");

let sensorValue = robutek.readSensor("LineFL");
console.log(sensorValue);
```



## Startování na tlačítko
Aby se nám program lépe startoval, přidáme "statovou proměnou", kam si uložíme, jestli robot zrovna sleduje čáru.

Tuto proměnou nastavíme na `true` nebo `false` po stisku tlačítka. Zároveň pustíme nebo zastavíme motory.

Tentokrát přistupujeme k pravému a levému motoru napřímo, abychom je mohli řídit více precizně.

```ts
// Sledujeme teď čáru?
let following = false;

// Zapínací tlačítko
gpio.pinMode(robutek.Pins.ButtonLeft, gpio.PinMode.INPUT);
gpio.on("rising", robutek.Pins.ButtonLeft, async () => {
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
    await sleep(10);
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
import * as gpio from "gpio";
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V2");;

// Sledujeme teď čáru?
let following = false;

// Zapínací tlačítko
gpio.pinMode(robutek.Pins.ButtonLeft, gpio.PinMode.INPUT);
gpio.on("rising", robutek.Pins.ButtonLeft, async () => {
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
    await sleep(10);
  }
}

main().catch(console.error);
```

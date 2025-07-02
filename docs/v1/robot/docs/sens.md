# Docs - Ovládání senzorů odrazu světla

Na spodní straně Robůtka se nachází 8 senzorů odrazu světla. Tyto senzory umožňují rozpoznávat, jak tmavá nebo světlá je plocha pod Robůtkem. Senzory indikují odrazivost povrchu pomocí napětí, které Robůtek měří a převádí na číslo. Čím vyšší je pak naměřená hodnota, tím světlejší povrch je. Aby naměřená hodnota byla co nejpřesnější, senzory si přisvětlují plochu pomocí infračerveného světla.

Senzory jsou uspořádány do dvou sad po čtyřech senzorech (A1, A2, A3, A4 a B1, B2, B3, B4), mezi kterými se přepíná podle toho, který senzor v danou chvíli chceme použít. Přepínání mezi sadami je řízeno pomocí pinu `IO8` a logická hodnota 1 aktivuje sadu A, zatímco logická hodnota 0 aktivuje sadu B. Přepínání mezi sadami senzorů trvá krátký okamžit, během kterého mohou senzory měřit špatné hodnoty. Je tedy potřeba alespoň 1 ms počkat, než začneme číst hodnoty senzorů.

Přisvětlení senzorů je potřeba zapnout samostatně pomocí pinu `IO47`. Pokud je tento pin nastaven na logickou hodnotu 1, senzory si přisvětlují plochu, pokud je nastaven na logickou hodnotu 0, senzory si nepřisvětlují plochu.

Protože je senzorů hodně a je potřeba je nastavovat a přepínat, v knihovně `robutek.js` jsme nachystali několik funkcí, které používání senzorů usnadňují.

## Import knihovny

Nejprve si musíme knihovnu importovat. To uděláme pomocí příkazu `import`:

```ts
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V1");
```

## Dostupné rozhraní

Při importu knihovny se senzory správně nastaví a připraví k použití. K jejich následnému ovládání nám už stačí pouze dvě funkce:

- `readSensor(sensor: SensorType): number` - vrátí naměřenou hodnotu senzoru. Parametr `sensor` je typ senzoru, který chceme číst. Dostupné senzory jsou popsány v nápovědě ve VSCode.

## Příklad použití

Nyní si ukážeme, jak můžeme číst hodnoty senzorů. Nejprve si musíme importovat knihovnu a poté můžeme začít s čtením hodnot senzorů.

```ts
import { createRobutek } from "./libs/robutek.js"
const robutek = createRobutek("V1");

let sensorValue = robutek.readSensor("LineFL");
console.log(sensorValue);
```

# Widgety
[GridUI designer](https://gridui.robotikabrno.cz/) nám nabízí spoustu různých widgetů, ale co všechno s nimi dokážeme vyvádět? Tady jich většinu projdeme a ukážeme si všechny informace, které jsme schopni ze jednotlivých widgetů tahat a naopak co u nich všechno můžeme kódem nastavovat.

[GridUI designer](https://gridui.robotikabrno.cz/){ .md-button .md-button--primary }

[Stáhnout ZIP s prázdným projektem](blank-gridui.zip){ .md-button .md-button--primary }

## Obecné vlastnosti

Nejprve však zopakování obecných vlastností z [předchozího bloku](index.md). U každého widgetu si v designeru nastavujeme několik obecných vlastností: `id` widgetu a jeho pozici (`x` a `y`) a velikost (výška `h` a šířka `w`). Tyto vlastnosti jsme z robůtka schopni pouze číst a ne upravovat.

![](assets\generalProperties.png)

!!! NOTE "Na obrázku si všimnete ještě dvou dalších řádků: `tab` a `css`. Těm se budeme věnovat v následujících blocích (MOŽNÁ, TODO!)."

K vlastnostem widgetu přistupujeme pomocí `id` příkazem `Layout.<id>.<vlastnost>`. Budeme-li tedy mít na rozhraní nějaký widget s `id = mujWidget`, jeho výšku přečteme příkazem `Layout.mujWidget.widgetH`, x-ovou souřadnici příkazem `Layout.mujWidget.widgetX` atd.

## Bar

![](assets\bar.png)

U widgetu Bar můžeme nastavovat a číst následující vlastnosti: barvu, velikost fontu popisku, zobrazení popisku(true/false), minimální a maximální hodnotu a aktuální hodnotu.
```ts
Layout.Bar1.color = "rgb(150 0 85)"
Layout.Bar1.fontSize = 20
Layout.Bar1.showValue = true

Layout.Bar1.max = 50
Layout.Bar1.min = 10
Layout.Bar1.value = 0
```

## Tlačítko

![](assets\button.png)

U widgetu Button (tlačítko) můžeme hlavně číst, jestli je zmáčknuté nebo ne. Taky můžeme uvnitř funkce `Layout.begin()` definovat, co se stane při zmáčknutí a puštění tlačítka.
```ts
const OWNER = "owner";
const DEVICE_NAME = "robutek";

Layout.begin(OWNER, DEVICE_NAME, builder => {
    builder.Button1.onPress(state => {
        console.log("Tlačítko bylo zmáčknuto."); // kód spuštěný zmáčknutím tlačítka
    });

    builder.Button1.onRelease(state => {
        console.log("Tlačítko bylo puštěno."); // kód spuštěný puštěním tlačítka
    });
});

setInterval(() => { // jednou za sekundu vypisuje do konzole stav tlačítka (true => je zmáčknuté, false => je puštěné)
    console.log(Layout.Button1.pressed); }, 1000);

```
??? info "A co znamená to `state`?"
    Do proměnné `state` (ve funkci `builder.Button1.onPress()`) se nám ukládá aktuální stav tlačítka (nebo jakéhokoli jiného použitého widgetu) včetné všech jeho vlastností. Uvnitř následujícího bloku kódu tedy můžeme místo `Layout.Button1.color` apod. psát `state.color`. Jde o proměnnou, můžete jí tedy dát jakékoliv jméno.

Také můžeme nastavovat všechny vlastnosti tlačítka, viz následující blok kódu:
```ts
Layout.Button1.text = "Čudlík" // popisek tlačítka
Layout.Button1.color = "rgb(0 0 0)" // barva popisku
Layout.Button1.fontSize = 35    // velikost fontu popisku
Layout.Button1.align = "flex-start" // zarovnání popisku
Layout.Button1.valign = "center" // vertikální zarovnání popisku

Layout.Button1.background = "rgb(0 200 130)" // barva tlačítka
Layout.Button1.disabled = false // určuje, jeli tlačítko zmáčknutelné
```
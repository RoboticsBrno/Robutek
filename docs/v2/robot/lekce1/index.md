# Lekce 1 - První projekt

Zde si vyzkoušíme vytvořit první projekt a nahrát jej do Robůtka.

=== "Přes VS Code rozšíření"

    Odkaz na projekt:
    ```
    https://robutek.robotikabrno.cz/v2/robot/lekce1/example1.tar.gz
    ```
    !!! warning "Varování"
        Odkaz si zkopírujte než začnete tvořit projekt, když vyjedete z VSCode při vytváření projektu, vytváření projektu se vám zruší.

    1. V prvním kroku si na počítači nachystáme složku `RoboCamp-2025`, do které si budeme ukládat veškeré projekty.
    2. Klikneme pravým tlačítkem na ikonku `Visual Studio Code` a vybereme možnost `New window`.
    3. Dále v rozšíření Jaculus vybereme `Create Project`.
    4. Zvolíme umístění projektu do složky `RoboCamp-2025`.
    5. Zadáme název projektu, např. `prvniProjekt`, potvrdíme `Enter`.
    6. Vložíme odkaz na projekt, potvrdíme `Enter`.
    7. Otevře se nám vytvořený projekt.
    8. Připojíme Robůtka přes `USB-C`. Pokud `USB-C` nefunguje, použijeme `micro-USB`.
    9. V levém spodním rohu vybereme :material-power-plug:`Select COM port` pro výběr portu, na kterém je Robůtek připojený. Poté se nápis změní na vybraný port.

        ??? tip "Vidíme více portů"
            Pokud se nám v nabídce zobrazí více portů, odpojíme Robůtka a zjistíme, který port zmizel. Po připojení Robůtka tento port vybereme.

    10. Dále zvolíme :material-eye:`Monitor`, ten slouží pro komunikaci se zařízením.


=== "Ručně ze zipu"
    [Stáhnout ZIP s prvním projektem](./example1.zip){ .md-button .md-button--primary }

    1. V prvním kroku si na počítači nachystáme složku `RoboCamp-2025`, do které si budeme ukládat veškeré projekty.
    2. Dále si [stáhneme zip](./example1.zip) soubor s prvním projektem.
    3. Poté si jej **rozbalíme** do vytvořené složky k táboru.
    4. Spustíme VSCode a pomocí záložky `File` -> `Open Folder` vybereme složku s projektem.
    5. Připojíme Robůtka přes `USB-C`. Pokud `USB-C` nefunguje, použijeme `micro-USB`.
    6. V levém spodním rohu vybereme :material-power-plug:`Select COM port` pro výběr portu, na kterém je Robůtek připojený. Poté se nápis změní na vybraný port.

        ??? tip "Vidíme více portů"
            Pokud se nám v nabídce zobrazí více portů, odpojíme Robůtka a zjistíme, který port zmizel. Po připojení Robůtka tento port vybereme.

    7. Dále zvolíme :material-eye:`Monitor`, ten slouží pro komunikaci se zařízením.

## Nahrání programu

Pokud nám funguje připojení na :material-eye:`Monitor` a běží nám komunikace se zařízením, můžeme do zařízení zkusit nahrát náš první program.

1. Ve VSCode máme otevřený první projekt. V levém `Exploreru` (`Průzkumníku`) vybereme soubor ze  `src` -> `index.ts`. V něm vidíme náš první program.
2. Poté zvolíme :material-arrow-right:`Build, Flash and Monitor` pro nahrání programu do zařízení.

	!!! danger "Pokud se program nenahraje za ~10 vteřin, zkuste zmáčknout tlačítko označené `EN` a program nahrát znovu."
	
	![První program](./assets/first-code.png)
	<!-- TODO: update 2 and 3 current library and jaculus implementations -->
3. Měli bychom vidět výstup z programu.
	```bash
	$ jac monitor --port COM7
	Connecting to serial at COM7 at 921600 bauds... Connected.

	Robotický tábor 2025, zdraví Jirka Vácha!
	Robotický tábor 2025, zdraví Jirka Vácha!
	```
4. Pro ukončení terminálu, do něj klikneme a stiskneme ++ctrl+c++.




## Úprava programu

Pokud nám funguje nahrávání kódu, můžeme se na něj podívat a zkusit jej upravit.
Ve zdrojovém kódu jsou komentáře (`// tohle je komentář`), které nám popisují, co který řádek dělá.

1. Prostudujeme si zdrojový kód.
2. Upravíme pozdrav na své jméno.

	??? note "Řešení"
		```ts
		...
		console.log("Robotický tábor 2025, zdraví Franta Flinta!");  // tady jsem změnil své jméno
		...
		```

3. Pokusíme se změnit rychlost vypisování.

    ??? note "Řešení"
        ```ts
        ...
        setInterval(() => { /* náš kód */ }, 500); // čas opakování se udává v milisekundách (1000 ms je 1 sekunda)
        ...
        ```

4. Upravíme barvu.

    ??? note "Řešení"
        Barvu lze zadat ve formátu RGB - poměr červené, zelené a modré barvy 
        ```ts
        ...
        ledStrip.set(0, { r: 0, g: 255, b: 0 }); // nastavíme barvu LED na Robůtkovi na zelenou
        ...
        ```
        Můžeme také využít předem definované barvy. 
        ```ts
        import * as colors from "./libs/colors.js"; // musíme na začátku programu importovat knihovnu s barvami
        ledStrip.set(0, colors.blue); // nastavíme barvu na modrou
        ```
        Předem definované barvy:

		- `red`
		- `orange`
		- `yellow`
		- `green`
		- `light_blue`
		- `blue`
		- `purple`
		- `pink`
		- `white`
		- `off`

# Lekce 1.5 - Dálkové ovládání

!!! tip "Pokud už máme zapájené motory a složeného Robůtka, můžeme ho vyzkoušet přes dálkové ovládání"

=== "Odkaz"
    ```
    https://robutek.robotikabrno.cz/v2/robot/lekce1/example-gridui.tar.gz
    ```
=== "Zip"
    [Stáhnout ZIP](./example-gridui.zip){ .md-button .md-button--primary }

1. Otevřeme si projekt.

2. V projektu v `src/index.ts` upravíme proměnné `OWNER` a `DEVICE_NAME` v horní části na naše jméno.

    ![](assets/gridui_owner.png)

3. Na bočním panelu vybereme rozšíření `Jaculus`.
4. V otevřeném panelu klikneme na `WiFi Configuration` a poté na `Configure WiFi`.

    ![](assets/wifi-config.png)

5. Vybereme možnost `Add a WiFi network`.

	![](assets/add-wifi.png)

6. Do pole zadáme název WiFi sítě. Na táboře použijeme wifi pro roboty, `RoboRaj`.

	![](assets/wifi-ssid.png)

7. Dole v terminálu zadáme heslo `PlnoRobutku`.

	![](assets/wifi-passwd.png)

8. Znovu klikneme na `Config WiFi` a vybereme `Set WiFI to Station mode (connect to wifi)`.

	![](assets/connect-wifi.png)

## Připojení na Robůtka
Robůtek je teď připojený na WiFi, takže s ním můžeme komunikovat přes telefony a počítače

!!! danger "Naše zařízení musí být připojené na stejné WiFi jako Robůtek (na táboře `RoboRaj`, heslo `PlnoRobutku`)."

### Android
Stáhneme si aplikaci `RBController` pro Android.

[Aplikace RBController](https://play.google.com/store/apps/details?id=com.tassadar.rbcontroller&hl=en&pli=1){ .md-button .md-button--primary }

1. Po otevření programu nastavíme jméno majitele na to stejné, co jsme napsali do proměnné `OWNER` v kódu. Jinak Robůtka neuvidíme!
2. Pokud je telefon na stejné WiFi jako Robůtek, aplikace ho najde a můžeme ho ovládat.

### iOS a počítač

1. Po nahrání programu vidíme v terminálu IP adresu Robůtka, nebo ji zjistíme kliknutím na `Config WiFi` a vybráním možnosti `Display current WiFi config`.

    !!! warning "Při použití tlačítka `Display current WiFi config` nesmí na Robůtkovi běžet program, můžeme ho vypnout zmáčknutím ++ctrl+c++ v terminálu."


	![](assets/gridui_ip.png)

2. Zadáme tuto IP do prohlížeče, např. `http://192.168.4.1`. Načte se nám stránka s ovládáním.

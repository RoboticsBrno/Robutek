# Docs - WiFi

K Robůtkovi se můžeme připojit i bezdrátově pomocí WiFi. K tomu ale potřebujeme aby se Robůtek buď [připojil k existující síti](#pripojeni-k-existujici-siti) nebo [vytvořil novou síť](#vytvoreni-nove-site).

## Připojení k existující síti

1. Klikneme na tlačítko `Config WiFi` na dolní liště. Zde budeme dělat všechno nastavení WiFi. <br>
![](assets/config-wifi-btn.png) <br>

2. Vybereme možnost `Add WiFi network`.
![](assets/add-wifi-network.png) <br>

3. A zadáme název sítě (SSID)
![](assets/input-ssid.png) <br>

    !!! note "Co dělat když název sítě má v sobě mezeru"
        - Pokud název sítě má v sobě mezeru, musíme ho vložit do uvozovek, například `"Hele mezera"`.

4. Dole v terminále se nám zobrazí místo na zadání hesla.
![](assets/input-password.png) <br>

5. Po zadání hesla be se nám zobrazí správa že vše proběhlo v pořádku.
![](assets/wifi-added.png) <br>

6. Poté musíme znovu kliknout na tlačítko `Config WiFi` a vybrat možnost `Set WiFI to Station mode (connect to WiFi)`.
![](assets/wifi-station-mode.png) <br>

## Vytvoření nové sítě

1. Klikneme na tlačítko `Config WiFi` na dolní liště. Zde budeme dělat všechno nastavení WiFi. <br>
![](assets/config-wifi-btn.png) <br>

2. Vybereme možnost `Set WiFi to AP mode (create a hotspot)`.
![](assets/add-wifi-network.png) <br>

3. A zadáme název sítě (SSID)
![](assets/input-ssid.png) <br>

    !!! note "Co dělat když název sítě má v sobě mezeru"
        - Pokud název sítě má v sobě mezeru, musíme ho vložit do uvozovek, například `"Hele mezera"`.

4. Dole v terminále se nám zobrazí místo na zadání hesla.
![](assets/input-password.png) <br>

## Vypnutí WiFi

1. Klikneme na tlačítko `Config WiFi` na dolní liště. <br>
![](assets/config-wifi-btn.png) <br>

2. Vybereme možnost `Disable WiFi`.
![](assets/disable-wifi.png) <br>

## Zjištení IP adresy

1. Klikneme na tlačítko `Config WiFi` na dolní liště. <br>
![](assets/config-wifi-btn.png) <br>

2.  Vybereme možnost `Display current WiFI config`.<br>
![](assets/display-wifi-config.png) <br>

3. A v terminále se zobrazí IP adresa (Nějakou dobu trvá než se Robůtek připojí k sítí, takže je možné že to bude chvíly trvat) <br>
![](assets/ip-address.png) <br>

Nebo v kódu můžete získat IP adresu pomocí funkce `currentIp()`:

```ts
import * as wifi from "wifi";

console.log(wifi.currentIp())
```

## Připojení k síti

1.
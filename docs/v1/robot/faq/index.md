# Často kladené dotazy

## Do kterého USB mám připojit kabel?
- Používej konektor `USB-C`, pokud ti nejde nahrát kód tak přes `micro-USB`.
- ??? "Proč ten první nefunguje?"
	`USB-C` je softwarové `USB` na ESP32 a pokud si nahraješ kód, který rozbije ESP tak nebude fungovat.<br>Naopak `micro-USB` je připojené přes převodník takže to se používá v případě nefunkčnosti `USB-C` (potenciální chyby: chyba při nahrávání, nekonečná smyčka v kódu, atd.).

## Jak komunikovat se zařízením?
- V levém spodním rohu vyberte COM port (`Select COM Port`).
- Poté je možné spustit monitor (`Monitor`) skrze ikonku v levém spodním rohu.
- Následně se vám otevře terminál, ve kterém vidíte výstup ze zařízení.

## Jak se odpojit od zařízení?
- Pomocí klaves ++ctrl+c++ se odpojíte z monitoru.

## Jak zjistit verzi firmwaru v Jaculu?
- Připojte Jacula k počítači.
- Pomocí ++ctrl+shift+p++ se vám otevře okno pro zadávání příkazů.
- Zadejte `Jaculus: Get firmware version`.
- Výsledek by se měl objevit v terminálu.

# Externí Moduly

## Sdílená I2C sběrnice

Robůtek vyvádí sdílenou `I2C` sběrnici pro chytré periferie a externí senzory.

| Signál | Pin |
| --- | --- |
| `SDA` | `IO10` |
| `SCL` | `IO3` |

Interní využití:

- vestavěný barevný senzor
- podpůrná logika pro správu baterie používaná referenčním firmwarem

Stejná sběrnice je dostupná i externím modulům.

## Senzor vzdálenosti VL53L0X

Volitelný senzor vzdálenosti se připojuje přes `I2C`.

### Co poskytuje

- optické měření vzdálenosti
- výstup v milimetrech
- další údaje o kvalitě měření v dodaném ovladači

### Poznámky k integraci

- umístěte jej tak, aby nebylo zakryté optické okénko
- ponechte mu volný výhled
- nespoléhejte se na jediné měření při tmavém nebo šikmém cíli
- při více `I2C` zařízeních je potřeba hlídat konflikt adres

## Externí barevný senzor

Volitelný externí RGB senzor je také připojený na sdílenou `I2C` sběrnici.

Dodaný ovladač rozlišuje vestavěný a externí senzor pomocí adresy:

- adresa vestavěného senzoru: `0x43`
- adresa externího senzoru: `0x42`

Oba senzory mohou být současně na stejné sběrnici, pokud zůstane zachována správná adresace.

### Co měří

- červenou
- zelenou
- modrou
- infračervenou složku
- clear světlo

Použitelnost výsledků závisí na kalibraci a stabilní geometrii měření.

## Jednoduché digitální příslušenství

Podporováno je i jednoduché příslušenství se signálem, napájením a zemí:

- tlačítkové moduly
- servo mechanismy
- LED pásky s vyhrazenou datovou linkou

Takové moduly nejsou vázané na Jaculus. Požadavky na firmware:

- digitální vstup pro tlačítka
- PWM pro servo signál
- časování `WS2812B` pro adresovatelné LED
- `I2C` komunikaci pro chytré senzory

# Vestavěné Senzory

## Odrazové senzory

Robůtek obsahuje `8` spodních odrazových senzorů pro sledování čáry a detekci povrchu.

### Jak fungují

Každý senzor osvětluje podklad infračerveným světlem a měří intenzitu odrazu.

- světlejší povrch -> vyšší hodnota
- tmavší povrch -> nižší hodnota

Rozsah hodnot závisí na firmware a konfiguraci ADC. Typický rozsah při 10bitovém čtení je přibližně `0..1023`.

### Elektrická struktura

Senzory jsou rozděleny do dvou bank po čtyřech:

- banka `A`: senzory v přední / line části
- banka `B`: senzory v oblasti u kol

V daný okamžik je k ADC připojena pouze jedna banka.

- banku `A` zvolíte nastavením `IO8 = 1`
- banku `B` zvolíte nastavením `IO8 = 0`

Po přepnutí banky je nutné vyčkat přibližně `2 ms` na ustálení měření.

### Řízení IR přisvětlení

IR emitory nejsou trvale aktivní.

- `IO47 = 1` zapne IR přisvětlení
- `IO47 = 0` IR přisvětlení vypne

Při nízkých nebo nestabilních hodnotách je vhodné nejdříve ověřit stav emitorů.

### Praktický postup čtení

1. Zapněte IR emitory.
2. Vyberte banku senzorů.
3. Počkejte asi `2 ms`.
4. Přečtěte čtyři ADC kanály na `IO4..IO7`.
5. Hodnoty použijte přímo nebo je převeďte na kalibrované veličiny.

### Poznámky

- výsledek závisí na barvě a materiálu podkladu
- výsledek závisí na vzdálenosti od povrchu
- prahy je vhodné kalibrovat pro konkrétní prostředí
- pro sledování čáry je vhodná krátká kalibrace po startu

## Enkodéry kol

Každý motor má kvadraturní enkodér se dvěma digitálními kanály.

### Mapování pinů

| Enkodér | Kanál A | Kanál B |
| --- | --- | --- |
| Levý | `IO40` | `IO39` |
| Pravý | `IO41` | `IO42` |

### Co poskytují

Enkodéry poskytují podklady pro výpočet:

- směr otáčení kola
- rychlost kola
- ujetou vzdálenost
- změnu natočení robota

Použití: uzavřené řízení rychlosti, odometrie, přesnější otáčení.

## Uživatelská tlačítka

Na desce jsou dvě vestavěná tlačítka:

| Tlačítko | Pin |
| --- | --- |
| Levé | `IO2` |
| Pravé | `IO0` |

Elektricky jde o digitální vstupy.

## Vestavěný barevný senzor

Robůtek obsahuje jeden vestavěný RGB / barevný senzor připojený ke sdílené `I2C` sběrnici.

### Sběrnice a adresace

- sběrnice: sdílené `I2C`
- `SDA = IO10`
- `SCL = IO3`
- adresový bit vestavěného senzoru: `high`
- adresa používaná ovladačem: `0x43`

### Dostupné kanály

Barevný senzor umí měřit:

- červenou
- zelenou
- modrou
- infračervenou složku
- clear / nefiltrované světlo

### Model výstupu

Ovladač poskytuje:

- surové 16bitové hodnoty jednotlivých kanálů, nebo
- kalibrované normalizované hodnoty v rozsahu `0..1`

Pro použití v reálném prostředí je doporučena kalibrace vůči bílé a černé referenční ploše.

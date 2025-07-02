# Jak na vývoj

## Instalace nástrojů
Budeme potřebovat:
- `git`
- `python3` + `pip` (na Windows doporučuji z Win storu)

## Repo
Naklonujeme si repozitář:

```bash
git clone https://github.com/RoboticsBrno/Robutek.git
```
nebo
```bash
git clone git@github.com:RoboticsBrno/Robutek.git
```

## Konfigurace

Otevři projekt a v terminálu spusť:

pro linux a macos:
```bash
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
```

pro windows:
```bash
python3 -m venv .venv
.venv\Scripts\activate 
python3 -m pip install -r requirements.txt
```


## Znovu otevření už nainstalovaných toolů
pro linux a macos:
```bash
source .venv/bin/activate
```

pro windows:
```bash
.venv\Scripts\activate 
```


## Práce s dokumentací

Lokální spuštění dokumentace:
- pro v1 - `mkdocs serve --config-file mkdocs.v1.yml`
- pro v2 - `mkdocs serve --config-file mkdocs.v2.yml`


## Vychytávky
Pro více rozjetých dokumentací je možné použít `--dev-addr 127.0.0.1:8001` pro specifikaci adresy a portu.

## Práce s obrázky

Obrázky přidávej do podsložek v `docs` podle adresy stránky, na které se mají zobrazit.
Uvnitř této stránky vytvoř složku `assets-large` a vlož do ní obrázky v plné velikosti.

Plugin [mkdocs-resize-images](https://github.com/JakubAndrysek/mkdocs-resize-images) automaticky rozpozná
změny v adresáři `assets-large` a při buildu zmenší obrázky do požadované velikosti a uloží je do složky `assets`.
Složka `assets-large` se neukládá do gitu, protože by byla zbytečně velká. Velké fotky si necháme jen lokálně a po dokončení návodu je můžete smazat.

Podporovené soubory jsou `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`.

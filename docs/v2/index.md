---
title: Robůtek
---

# Vítejte na stránkách projektu Robůtek!

## Rozcestník

1. [Úvod](#Úvod)
2. [Návod na složení](robotAssembly/stage1)
3. [Dokumentace]()
4. [Programovací lekce](robot/)

## Úvod

!!! note "Toto je dokumentace pro verzi V2 Robůtka."
    Hledáte verzi **V1**?
    Najdete ji [tady](../v1).

Robůtek je robotická platforma určená pro výuku programování a robotiky, a zároveň jako rozšiřitelná platforma pro stavění vlastních robotů s minimálními vstupními nároky.

Robůtek v základu umí:

- jezdit,
- kreslit fixou,
- následovat čáru,
- pohybovat se bludištěm,
- přidávat další senzory

---

## Schopnosti

### Pohon a snímání
- **Diferenciální pohon**
- **Enkodéry na kolech** pro přesný pohyb
- **IR senzory** pro sledování čáry

### Vnímání barev a světla
- **RGB senzor** podvozku pro detekci barev na podlaze
- **RGB podsvícení** Robůtka

### Kreslení
- **Držák na fixu** pro kreslení na papír
- **Servo** na rozšiřující palubě pro **zvedání fixy**

### Rozšiřující paluba
- **Adresovatelný RGB pásek**
- **Laserový senzor vzdálenosti (VL53L0X)**
- **Přídavný RGB senzor**

---

## Jak začít

1. **Sestavte hardware** podle [návodu na složení](robotAssembly/stage1).
2. **Připravte prostředí pro Jaculus** – nainstalujte a postupujte dle [návodu](robot/lekce0/).
3. **Nahrajte základní projekt** – využijte referenční **Robutek library** (viz níže) jako startovní bod.
4. **Vyzkoušejte si senzory a pohyb** – zkuste si zajezdit, vypčíst enkodéry, IR senzory na čáru a RGB senzor.
5. **Vyzkoušejte kreslení** – zasuňte fixu do držáku, servo zvedání fixy použijte pro start/stop kreslení.

!!! tip "Rychlý start s knihovnou"
    Složka `robutekLibrary` slouží jako **referenční projekt** pro ostatní projekty v dokumentaci (kopírují se `@types` a `src/libs`).

---

## Dokumentace

### Architektura (přehled)
- **Řídicí jednotka:** ESP32-S3
- **Pohon:** diferenciální (2 motory), **enkodéry** na kolech
- **Senzory:** IR pro čáru, RGB senzor (spodek), **VL53L0X** pro vzdálenost, přídavný RGB senzor na palubě
- **Osvětlení: adresovatelný RGB pásek**, **RGB podsvícení** šasi
- **Kreslení:** Servo na kontrolu kreslení
- **Programování:** **Jaculus** (viz [oficiální web](https://jaculus.org/getting-started/))

---

## Programovací lekce

V rámci [Robotického tábora 2025](https://robotickytabor.cz/) vznikly lekce pro výuku programování a práce s Robůtky.
Byly zamýšlené pro práci s lektorem a nejsou vhodné pro samostatné studium.
Nacházejí se v sekci [**Programovací lekce**](robot/).

---

## Bezpečnost a doporučení

- Před kreslením zkontrolujte zajištění **fixy** v držáku a pracovní plochu.
- Při práci s **napájením** a **motory** dbejte na správnou polaritu a mechanické upevnění.
- Při používání **laserového senzoru vzdálenosti (VL53L0X)** nehleďte do emitoru z bezprostřední blízkosti.

---

## Historie verzí

| Rok  | Verze | Popis                                                          |
|------|-------|----------------------------------------------------------------|
| 2024 | v1    | První plnohodnotný Robůtek                                    |
| 2025 | v2    | Opravené chyby na desce, RGB senzor, větší přesnost motorů    |

### Co je nového ve V2

- Integrovaný **RGB senzor** pro detekci barev na podlaze.
- **RGB podsvícení** pro hezčí vzhled a vizuální signalizaci.
- **Zjednodušená stavba** díky integrovaným encodérům

---


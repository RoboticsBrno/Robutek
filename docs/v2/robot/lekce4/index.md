# Lekce 4 - Motory

V této lekci si vyzkoušíme točit motory a pohybovat robotem.

!!! tip "Položme si Robůtka na něco tak, aby se kola nedotýkala země a mohla se volně točit - tak můžeme kód otestovat bez toho, aby Robůtek sjel ze stolu."

=== "Odkaz"
    ```
    https://robutek.robotikabrno.cz/v2/robot/blank_project.tar.gz
    ```
=== "Zip"
    [Stáhnout ZIP](../blank_project.zip){ .md-button .md-button--primary }

```typescript
import { createRobutek } from "./libs/robutek.js";
import * as colors from "./libs/colors.js";
import * as gpio from "gpio";
import { SmartLed, LED_WS2812B } from "smartled";
const robutek = createRobutek("V2");
```

To je dobrý začátek - pokračujme na konci souboru.

# Async main funkce

Motory jsou tzv. asynchroní, to znamená, že se ovládají příkazem, který může trvat delší dobu, než se vykoná
(například "ujeď 50cm" bude trvat několik vteřin).

Abychom mohli motory používat, je třeba přidat tuto "kostru" s `async function()`. Klidně ji zkopírujme, patří na konec souboru `src/index.ts`.

```typescript
async function main() {
  // Tady bude kód na ovládání motorů
}

main().catch(console.error);
```

# Ježdění na vzdálenost

Ježdění má tři části - nastavení rychlosti, rampy, a samotný pohyb:

<!-- TODO change speed limit, maybe tell kids its not a hard limit and that they can experiment -->

- `robutek.setSpeed(SPEED)` - _SPEED_ je číslo milimetrech za vteřinu, na Robůtkovi prakticky od -800 do 800 (záporné značí couvání)
- `robutek.setRamp(ACCEL)` - _ACCEL_ je číslo udávající zrychlení Robůtka v mm/s^2. V případě, že je rovna nule, je zrychlení okamžité.
- `await robutek.move(DIR, { distance: DISTANCE-MM })`
  - _DIR_ je desetinné číslo od -1 do 1, kdy
    - -1 je znamená úplně doleva,
    - 0 je rovně a
    - 1 je úplně doprava.
  - _DISTANCE-MM_ značí, jak daleko má robot jet v milimetrech

Zadávání parametrů rychlosti a rampy není potřeba opakovat při každém pohybu - knihovna si hodnotu pamatuje a při dalším volání funkce
`move` ji použije.

## Příklad

!!! warning "Operace s motorky píšeme do asynchroních funkcí, často do funkce main()"

```typescript
async function main() {
  robutek.setSpeed(100); // Nastav rychlost na 100 mm/s
  robutek.setRamp(2000); // Nastav zrychlení na 2000 mm/s^2
  await robutek.move(0, { distance: 100 }); // Ujeď 100 mm == 10 cm
}

main().catch(console.error);
```

**Úkol:** Zkus přidat kód, aby Robůtek dojel zase zpátky na stejné místo

??? note "Řešení"

    ```ts
    await robutek.move(0, { distance: -100 }) // Ujeď -100 mm == -10 cm
    ```

# Otáčení

Na otáčení má Robůtek připravenou funkci:

- `await robutek.rotate(ANGLE)` - Otočí Robůtka o _ANGLE_ stupňů rychlostí nastavenou přes `robutek.setSpeed`. Může být záporné číslo.

## Úkol

Napiš program tak, aby Robůtek popojel 10cm dopředu, otočil se čelem vzad (180 stupňů), a popojel zpátky na původní místo.
??? note "Řešení"

    ```ts
    import { createRobutek } from "./libs/robutek.js";
    const robutek = createRobutek("V2");

    async function main() {
        // Tady bude kód na ovládání motorů

        robutek.setSpeed(100);  // Nastav rychlost na 100 mm/s
        robutek.setRamp(2000);  // Nastav zrychlení na 2000 mm/s^2

        await robutek.move(0, { distance: 100 });  // Ujeď 10 cm

        await robutek.rotate(180);  // Otoč se o 180 stupňů

        await robutek.move(0, { distance: 100 });  // Ujeď 10 cm
    }

    main().catch(console.error);
    ```

# Tvary

Kombinováním `robutek.move` a `robutek.rotate` můžeš s Robůtkem "vyjezdit" různé tvary. Tento program s robotkem vyjezdí čtverec.

```ts
import { createRobutek } from "./libs/robutek.js";
const robutek = createRobutek("V2");

async function main() {
    // Tady bude kód na ovládání motorů

    robutek.setSpeed(100);  // Nastav rychlost na 100 mm/s

    await robutek.move(0, { distance: 300 });  // Ujeď 30 cm
    await robutek.rotate(90);
    await robutek.move(0, { distance: 300 });
    await robutek.rotate(90);
    await robutek.move(0, { distance: 300 });
    await robutek.rotate(90);
    await robutek.move(0, { distance: 300 });
    await robutek.rotate(90);
}

main().catch(console.error);
```

## Výstupní úkol V1

Napiš program tak, aby robotek vyjezdil šestiúhelník.

# Výstupní úkol V2

Napiš program tak, aby robot vyjezdil kruh.

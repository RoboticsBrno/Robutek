# Lekce 4 - Motory

V této lekci zkusíme točit motory a pohybovat robotem.

!!! tip "Polož si Robůtka na něco tak, aby se kola nedotýkala země a mohla se volně točit - tak můžeš kód otestovat bez toho, aby Robůtek sjel ze stolu."

Začneme opět s prázdným projektem, stáhni/nakopíruj si ho do nové složky pro tuto lekci:
[Stáhnout ZIP s prázdným projektem](../lekce2/blank_project.zip){ .md-button .md-button--primary }

Otevři ve Visual Studiu Code a najdi `src/index.ts`, mělo by tam být něco jako:

```typescript
import * as robutek from "./libs/robutek.js"
import { Pins } from "./libs/robutek.js"
import * as colors from "./libs/colors.js"
import * as gpio from "gpio"
import { SmartLed, LED_WS2812 } from "smartled"
```

To je dobrý začátek - pokračovat budeme na konci souboru.

# Async main funkce
Motory jsou tzv. asynchroní, to znamená, se ovládají příkazem, který může trvat delší dobu, než se vykoná
(například "ujeď 50cm" bude trvat několik vteřin).

Abychom mohli motori používat, je třeba přidat tuto "kostru" s `async function()`. Klidně ji nakopíruj, patří na konec souboru `src/index.ts`.

```typescript
async function main() {
    // Tady bude kód na ovládání motorů

}

main().catch(console.error)
```

# Ježdění na vzdálenost

Ježdění má dvě části - nastavení rychlosti, a samotný pohyb:

* `robutek.setSpeed(RYCHLOST)` - _RYCHLOST_ je číslo milimetrech za vteřinu, na Robůtkovi prakticky od -800 (couvání) do 800
* `await robutek.move(SMĚR, { distance: VZDÁLENOST_V_MM })`
    * _SMĚR_ je desetinné číslo od -1 do 1, kdy
        * -1 je znamená úplně doleva,
        * 0 je rovně a
        * 1 je úplně doprava.
    * *VZDÁLENOST_V_MM* značí, jak daleko má robot jet

## Příklad
Patří dovnitř `async function main()`, pod komentář v přechozím kusu kódu:

```typescript
    robutek.setSpeed(100) // Nastav rychlost na 100
    await robutek.move(0, { distance: 100 }) // Ujeď 100 mm == 10 cm
```

**Úkol:** Zkus přidat dva řádky kódu, aby Robůtek dojel zase zpátky na stejné místo
??? note "Řešení"
    ```ts
	robutek.setSpeed(-100) // Nastav rychlost na -100, couvání
    await robutek.move(0, { distance: 100 }) // Ujeď 100 mm == 10 cm
    ```


# Otáčení
Na otáčení má Robůtek připravenou funkci:

* `await robutek.rotate(ÚHEL)` - Otočí Robůtka o _ÚHEL_ stupňu rychlostá nastavenou přes `robutek.setSpeed`. Může být záporné číslo.

## Úkol
Napiš program tak, aby Robůtek popojel 10cm dopředu, otočil se čelem vzad (180 stupňů), a popojel zpátky na původní místo.
??? note "Řešení"
    ```ts
    import * as robutek from "./libs/robutek.js"
    import * as colors from "./libs/colors.js"
    import * as gpio from "gpio"
    import { SmartLed, LED_WS2812 } from "smartled"
    import { Pins } from "./libs/robutek.js";

    async function main() {
        // Tady bude kód na ovládání motorů

        robutek.setSpeed(100) // Nastav rychlost na 100

        await robutek.move(0, { distance: 100 }) // Ujeď 10 cm

        await robutek.rotate(180) // Otočit o 180 stupňů

        await robutek.move(0, { distance: 100 }) // Ujeď 10 cm
    }

    main().catch(console.error)
    ```

# Tvary
Kombinováním `robutek.move` a `robutek.rotate` můžeš s Robůtkem "vyjezdit" různé tvary.

**Úkol:** udělěj program tak, aby Robůtek objel čtverec a skončil zpátky na stejném místě.
??? note "Řešení"
    ```ts
    import * as robutek from "./libs/robutek.js"
    import * as colors from "./libs/colors.js"
    import * as gpio from "gpio"
    import { SmartLed, LED_WS2812 } from "smartled"
    import { Pins } from "./libs/robutek.js";

    async function main() {
        // Tady bude kód na ovládání motorů

        robutek.setSpeed(100) // Nastav rychlost na 100

        await robutek.move(0, { distance: 300 }) // Ujeď 30 cm
        await robutek.rotate(90)
        await robutek.move(0, { distance: 300 })
        await robutek.rotate(90)
        await robutek.move(0, { distance: 300 })
        await robutek.rotate(90)
        await robutek.move(0, { distance: 300 })
        await robutek.rotate(90)
    }

    main().catch(console.error)
    ```

# Docs - simulátor

K dvoukolému robůtkovi je dostupný [Simulátor](https://xondika.github.io/sitrusj/), 
ve kterém si můžete vyzkoušet své programy předtím, než si je nahrajete do svého robota.
Můžete si tak ověřit, že se váš program chová tak, jak má, aniž byste např. spadli s robotem
ze stolu, nebo pokreslili něco co nemáte.

Při otevření odkazu vás uvítá následující obrazovka:

![](assets/sim.png)

Vidíte zde hlavní okno s želvičkou (která reprezentuje našeho robůtka), programovací okno,
a textové okno na výstup našich programů.

## Simulační okno

V hlavním okně se vyskytuje (nejprve nehybná) želvička. Jakmile želvičce naprogramujeme nějaké chování,
uvidíme ho v tomto okně.

Pod oknem se vyskytují tlačítka, která slouží k interakci se simulačním prostředím.
První tlačítko `Grab turtle` nám umožní želvičku chytat. Po jeho stiskutí můžeme želvičku chytit (kliknutí), přenést (podržení), a položit na nové místo (puštění). Můžeme si ji tak kdykoliv nastavit do požadované polohy.

Stiskutí dalších tlačítek nám umožní kreslit tvary. Kreslit začneme stisknutím, při podržení měníme velikost, a jakmile myš pustíme, tvar je dokončený. Simulátor podporuje 3 základní tvary:

- `Draw line` nakreslí čáru

- `Draw rectangle` nakreslí obdélník

- `Draw circle` nakreslí kruh

Želvička je vybavena čárovými senzory, pomocí kterých umí na nakreslené tvary reagovat.

Podobně jako u skutečného robota simulace není úplně na milimetr přesná. Může se vám tak např. stát,
že opakujete stejný pohyb, a robot se otočí o stupeň více než by měl.

## Programovací okno

Do programovacího okna píšeme kód, který následně můžeme spustit pomocí tlačítka `Run code`.
Je zde dostupná funkcionalita pro ovládání robota pod názvem `robutek`. 
Chceme-li tedy, aby se želvička začala točit, můžeme napsat např. `robutek.rotate()`.
Zastavit ji můžeme kódem `robutek.stop()`.

Máme zde k dispozici rozhraní na ovládání robota a servo motoru, jako bychom zavolali příkaz
`import` na knihovnách `robutek` a `servo` (naznačeno v komentáři).
Samotné simulační prostředí však žije v izolaci.
Vlastní soubory na stránce neexistují, a tak nám `import` na ostatních souborech nebude fungovat.
Dodané rozhraní je to, co potřebujeme k tomu, abychom mohli ovládat pohyb a interagovat s
nakreslenými tvary.

V programovacím okně fungují standardní zkratky známé z `VS Code`, např. `Ctrl+C`, `Ctrl+V` pro kopírování a `Ctrl+Z` pro vracení předchozích změn. Kód se vám však může ztratit obnovením stránky!
Proto je lepší psát kód na vlastním počítači, kde si ho můžete uložit na budoucí použití, a do
programovacího okna ho jen kopírovat.

### Senzory

Senzory odrazivosti povrchu jsou na želvičce umístěny stejně jako na Robůtkovi, a můžeme je v simulaci používat.
Pro černou vrátí hodnotu 0, pro bílou těsně pod 150, a na okraji dané barvy něco mezi nimi.

## Výstup

Pokud náš program něco vypisuje pomocí `console.log()`, jeho výstup se zobrazí v okně označeném `Output`.

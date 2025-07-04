# Vylepšené sledování čáry

## Jízda na jeden senzor

V předchozím příkladu jsme se ptali na otázku jestli čára pod senzorem je, nebo není a spokojili jsme se jenom s odpovědí ano/ne. Naše čárové senzory ale mají určitý rozptyl. Pokud senzor sedí na pomezí černé a bílé, tak nám bude říkat, že vidí šedou barvu někde mezi. Toho můžeme využít.

Řekněme, že pracujeme s levým senzorem. Pak budeme předpokládat, že čára je napravo od něj a ztmavující se povrch pod senzorem znamená, že jedeme příliš doprava a zesvětlující se povrch znamená že jedeme příliš doleva. Ideální stav bude, pokud bude senzor nad hranicí bílé a černé.

TODO: program na jeden senzor

## Jemnější styl jízdy

Robůtek s sebou škube tam a zpátky, jak bychom to mohli vyřešit. Dřív jsme věděli, že čára je pod jedním senzorem, druhým senzorem a nebo "někde mezi". Teď ale víme jak moc mimo jsme a tak můžeme reagovat přiměřeně. Zvolíme si nějaký koeficient k_p, kterým vynásobíme rozdíl mezi ideální a reálnou pozicí vůči čáře a toto číslo použijeme při zatáčení

TODO: program s p-regulací

## Ještě jemnější styl jízdy

Robůtek už jezdí plynuleji a snad i rychleji. Dost možná se ale pořád třepe, ale i to se dá řešit. Můžeme si změřit rychlost s jakou se přibližuje/vzdaluje čáře a při příliš velké rychlosti změny "povolit otěže" (jet rovněji). Rychlost přibližování/vzdalování se čáře změříme jako rozdíl výstupu ze senzoru ve dvou po sobě jdoucích průchodech while cyklem. Takto získané číslo opět vynásobíme nějakým koeficientem k_d a výsledek odečteme od korekce vypočítané pomocí. Tento způsob řízení robůtka se nazývá PD regulace.

!!! tip "k_d je často potřeba nastavit opravdu velké pro dosažení plynule jízdy!"

TODO: program s p-d regulací

## Na závěr

- Pokud jste si beze změn stáhli a spustili kód z těchto stránek, tak vám robot jezdí docela pomalu. Dá se zrychlit? Jak moc?

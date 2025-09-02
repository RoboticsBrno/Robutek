# Logika procházení bludiště

U bludiště se standartně používá algoritmus pod názvem **pravidlo pravé ruky (right hand rule)**

![](assets/right-angle-rule.svg)

Pokud se můžeme otočit vpravo a udělat *"krok"*, uděláme ho, pokud ne, otočime se vlevo a zkusíme znova.

??? abstract "Pseudo kód"

    ```ts
    while (true){
        if (can_go_right()) {
            turn_right()
            make_step()
        }
        else {
            turn_left()
        }
    }
    ```
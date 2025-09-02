# Stage 2 - Servo, fixa

## Seznam potřebných věcí

 - Hotový robůtek ze stage 1
 - Servo motor
 - Stahovací zip pásek
 - Fixa
 - Držák na fixu
 - Šroubek a matka
 - Gumička

## Návod na složení

1. Sundejte z Robůtka dřevěnou palubu (pokud ji na robůtku máte).

    ![](assets/stage1/IMG-step12c.jpeg) <!-- don't change links, it should say stage 1  -->
    ![](assets/stage1/IMG-step12b.jpeg)
    ![](assets/stage1/IMG-step12a.jpeg)

2. Připravte si fixu, držák na fixu, šroubek, matku a přípravek.

    ![](assets/stage2/IMG-stage2-step1.jpeg)

3. Očistěte držák na fixu.

    ![](assets/stage2/IMG-stage2-step2a.jpeg)
    ![](assets/stage2/IMG-stage2-step2b-fix.jpeg)

4. Nasuňte držák na fixu.

    <!-- TODO add arrow and warning about black part orientation  -->

    ![](assets/stage2/IMG-stage2-step3mod.png)

5. Nasuňte na fixu přípravek. Zatlačte jej až na doraz.

    ![](assets/stage2/IMG-stage2-step4mod.png)

6. Držák přitiskněte k přípravku.

    ![](assets/stage2/IMG-stage2-step5mod.png)

7. Nasaďte na držák šroubek s matkou a sešroubujte.

    ![](assets/stage2/IMG-stage2-step6mod.png)

8. Protáhněte kabel od serva dřevěnou palubou.

    ![](assets/stage2/IMG-stage2-step7.jpeg)

9. Posaďte servo na dřevěnou palubu.

    ![](assets/stage2/IMG-stage2-step8.jpeg)

10. Protáhněte stahovací pásek kolem serva.

    ![](assets/stage2/IMG-stage2-step9a.jpeg)
    !!! danger "Utáhněte stahovací pásek tak, aby servem nešlo hnout."
    ![](assets/stage2/IMG-stage2-step9b.jpeg)

11. Odštípněte přečnívající stahovací pásek.

    ![](assets/stage2/IMG-stage2-step10a.jpeg)
    ![](assets/stage2/IMG-stage2-step10b.jpeg)

12. Připojte konektor kabelu serva ke třípinovému konektoru na základní desce Robůtka dle obrázku.

    !!! danger "Šipka na konektoru patří na datový pin na desce!"
    ![](assets/stage2/IMG-stage2-step11a.jpeg)
    ![](assets/stage2/IMG-stage2-step11b.jpeg)
    ![](assets/stage2/IMG-stage2-step11c.jpeg)

13. Přišroubujte dřevěnou palubu zpátky na Robůtka.

    ![](assets/stage2/IMG-stage2-step12a.jpeg)
    ![](assets/stage2/IMG-stage2-step12b.jpeg)

14. Otočte si servo do nulové pozice.

    Abychom mohli jednoduše pohybovat tužkou, jsou v knihovně dostupné konstanty pro pozice serva. Páču na servo je ale potřeba nasadit do správné pozice, aby konstanty odpovídaly.

    Pro správné umístění otočíme servo programem na pozici 0 a páčku nasadíme tak, aby směřovala přímo vzhůru. K tomu je potřeba spustit následující kód:

    ```ts
    import { createRobutek } from "./libs/robutek.js";
    import { Servo } from "./libs/servo.js";

    const robutek = createRobutek("V2");
    const servo = new Servo(robutek.Pins.Servo2, 1, 4);

    servo.write(0);
    ```

15. Nasaďte na servo páčku dle polohy na obrázku.

    ![](assets/stage2/IMG-stage2-step13a.jpeg)
    ![](assets/stage2/IMG-stage2-step13b.jpeg)

16. Obmotejte držák na fixu gumičkou.

    ![](assets/stage2/IMG-stage2-step14a.jpeg)

17. Fixu dejte do Robůtka a zahákněte páčku serva do díry v černém dílu.

    ![](assets/stage2/IMG-stage2-step14b.jpeg)

    !!! danger "<h2><b>S FIXOU NEJEZDĚTE ROBŮTKEM PO ZEMI, JENOM PO PAPÍŘE NA VYHRAZENÉM MÍSTĚ.</b><br>Lidem, co toto poruší, bude fixa zabavena!</h2>"

    ![](assets/stage2/IMG-stage2-final.JPG)
    Máte hotovo!

[Krok 3 - Led pásek](stage3.md){.md-button .md-button--primary}

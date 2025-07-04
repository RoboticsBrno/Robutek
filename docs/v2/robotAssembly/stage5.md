# Stage 5 - Senzor vzdálenosti

1. Uřizneme si dva 2 cm dlouhé kusy dřevíčka pro držák Lidaru.

    ![cutting tof holder](assets/stage5/cutting_tof_holder.jpg)


2. Uříznuté kousky si obrousíme aby byly krásně hladké.

    ![sanding tof holder](assets/stage5/sanding_tof_holder.jpg)


3. Herkules dáme na delší stranu jednoho z dílů a poté je slepíme do pravého úhlu.

    ![gluing tof holder](assets/stage5/gluing_tof_holder.jpg)
    ![glue on tof holder](assets/stage5/glue_on_tof_holder.jpg) ![](assets/stage5/glued_tof_holder.jpg)


4. Když nám Herkules zaschne, můžeme přilepit držák k Robůtkovi pomocí tavné pistole.

    ![attaching tof holder](assets/stage5/attaching_tof_holder.jpg)


5. K dálkoměru si připojíme 4x10cm kabel.

    ![tof with cables](assets/stage5/tof_w_cables.jpg)

6. Připojíme dálkoměr k Robůtkovi.

    ![tof w cables closeup](assets/stage5/tof_w_cables_closeup.jpg)
    ![tof connector](assets/stage5/tof_connector.jpg)

| Lidar |     | Robůtek |
| ----- | --- | ------- |
| VIN   | →   | VCC     |
| GND   | →   | GND     |
| SCL   | →   | IO9     |
| SDA   | →   | IO17    |
<hr>

7. Na troj-pin `PMOD-VCC` vedle pinů je třeba připojit jumper pro zvolení napětí 3V3, tedy propojit dva piny blíže okraji robota.

   !!! warning "Opatrně! Špatným nastavením `PMOD-VCC` lze zničit dálkoměr!"


8. Poté přilepíme dálkoměr k držáku pomocí tavné pistole.

    ![attaching tof](assets/stage5/attaching_tof.jpg)

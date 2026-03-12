/**
 * Barva je jednoduchá trojice červené, zelené, a modré složky
 * - R: červená (rozsah 0-255)
 * - G: zelená (rozsah 0-255)
 * - B: modrá (rozsah 0-255)
 */
export type Color = number;


/** * Vytvoří barvu z RGB hodnot
 * @param r Red (0-255)
 * @param g Green (0-255)
 * @param b Blue (0-255)
 * @returns Zadanou barvu
 */
export function rgb(r: number, g: number, b: number): Color {
    r = r & 0xff;
    g = g & 0xff;
    b = b & 0xff;
    return (r << 16) | (g << 8) | b;
}


/**
 * Vytvoří barvu z HSL hodnot
 * @param h Hue (0-360)
 * @param s Saturation (0-1)
 * @param l Lightness (0-1)
 * @returns Zadanou barvu
 */
export function hsl(h: number, s: number, l: number) : Color {
    const chroma = ( 1 - Math.abs( 2 * l - 1 ) * s );
    const hue = h / 60;
    const x = chroma * ( 1 - Math.abs( ( hue % 2 ) - 1 ) );

    let r = 0, g = 0, b = 0;
    if( hue > 0 && hue < 1 ){
        r = chroma;
        g = x;
        b = 0;
    } else if( hue >= 1 && hue < 2 ){
        r = x;
        g = chroma;
        b = 0;
    } else if( hue >= 2 && hue < 3 ){
        r = 0;
        g = chroma;
        b = x;
    } else if( hue >= 3 && hue < 4 ){
        r = 0;
        g = x;
        b = chroma;
    } else if( hue >= 4 && hue < 5 ){
        r = x;
        g = 0;
        b = chroma;
    } else {
        r = chroma;
        g = 0;
        b = x;
    }
    const correction = l - chroma / 2;
    r = ( r + correction ) * 255;
    g = ( g + correction ) * 255;
    b = ( b + correction ) * 255;

    return rgb( r, g, b );
}

/**
 * Vytvoří barvu podle odstínu a jasu
 * @param hue (0-360)
 * @param brightness (0-100) - 50 je defaultní hodnota
 * @returns Zadanou barvu
 */
export function rainbow( hue: number, brightness: number = 50) : Color {
    hue = Math.min( hue, 360 ); // Zajistíme, že zadaná hodnota není mimo rozsah
    // fix range to 0-100
    let brightness_mapped = Math.min(Math.max(brightness, 0), 100);
    return hsl(hue, 1, brightness_mapped / 100);
}

/* Základní barvy pro LED pásky*/
export const red = rainbow( 0 );
export const orange = rainbow( 27 );
export const yellow = rainbow( 54 );
export const green = rainbow( 110 );
export const light_blue = rainbow( 177 );
export const blue = rainbow( 240 );
export const purple = rainbow( 285 );
export const pink = rainbow( 323 );
export const white : Color = rgb(100, 100, 100);
export const off : Color = rgb(0, 0, 0);


export function sensorDataToRGB(data: [number, number, number]): Color {
    const [r, g, b] = data;
    return rgb(r, g, b);
}

export function rgbComponents(color: Color): [number, number, number] {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;
    return [r, g, b];
}

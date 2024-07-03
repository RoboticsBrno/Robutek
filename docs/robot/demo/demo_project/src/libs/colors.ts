/**
 * Barva je jednoduchá trojice červené, zelené, a modré složky
 * - R: červená (rozsah 0-255)
 * - G: zelená (rozsah 0-255)
 * - B: modrá (rozsah 0-255)
 */
interface Rgb {
    r: number;
    g: number;
    b: number;
}


/**
 * Alternativní způsob, jak vyjádřit barvu, je HSL:
 * - Hue: odstín (rozsah 0-360)
 * - Saturation: sytost barev (rozsah 0-1)
 * - Lightness: světlost (rozsah 0-1)
 */
interface Hsl {
    h: number;
    s: number;
    l: number;
}

/**
 * Mezi jednotlivými reprezentacemi lze převádět
 * @param hsl {Number} Hue (0-360), Saturation (0-1), Lightness (0-1)
 * @returns {Rgb} Red (0-255), Green (0-255), Blue (0-255)
 */
export function hsl_to_rbg( hsl: Hsl ) : Rgb {
    const chroma = ( 1 - Math.abs( 2 * hsl.l - 1 ) * hsl.s );
    const hue = hsl.h / 60;
    const x = chroma * ( 1 - Math.abs( ( hue % 2 ) - 1 ) );

    let color : Rgb = { r: 0, g: 0, b: 0 };
    if( hue > 0 && hue < 1 ){
        color = { r: chroma, g: x, b: 0 };
    } else if( hue >= 1 && hue < 2 ){
        color = { r: x, g: chroma, b: 0 };
    } else if( hue >= 2 && hue < 3 ){
        color = { r: 0, g: chroma, b: x };
    } else if( hue >= 3 && hue < 4 ){
        color = { r: 0, g: x, b: chroma };
    } else if( hue >= 4 && hue < 5 ){
        color = { r: x, g: 0, b: chroma };
    } else {
        color = { r: chroma, g: 0, b: x };
    }
    const correction = hsl.l - chroma / 2;
    color.r = ( color.r + correction ) * 255;
    color.g = ( color.g + correction ) * 255;
    color.b = ( color.b + correction ) * 255;

    return color;
}

/**
 * Funkce rainbow zafixuje sytost a světlost, a prochází barvami
 * @param hue (0-360)
 * @param brightness (0-100) - 50 je defaultní hodnota
 * @returns {Rgb}
 */
export function rainbow( hue: number, brightness: number = 50) : Rgb {
    hue = Math.min( hue, 360 ); // Zajistíme, že zadaná hodnota není mimo rozsah
    // fix range to 0-100
    let brightness_mapped = Math.min(Math.max(brightness, 0), 100);
    return hsl_to_rbg( { h: hue, s: 1, l: brightness_mapped / 100 } );
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
export const white : Rgb = { r: 100, g: 100, b: 100 };
export const off : Rgb = { r: 0, g: 0, b: 0 };
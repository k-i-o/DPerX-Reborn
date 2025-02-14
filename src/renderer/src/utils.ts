export function rgbToHex(color: string) {
    if (color.startsWith('#')) {
        return color;
    }

    const rgb = color.match(/\d+/g);
    if (!rgb) return color;

    const hex = rgb
        .slice(0, 3)
        .map((value: string) => {
            const hexValue = parseInt(value).toString(16);
            return hexValue.length === 1 ? '0' + hexValue : hexValue;
        })
        .join('');

    return `#${hex}`;
}

export function adjustAlpha(color: string, alpha: number): string {
    const rgb = hexToRgb(color);
    console.log(rgb);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export function lighten(color: string, percent: number): string {
    const rgb = hexToRgb(color);
    const lightenValue = (value: number) => Math.min(255, Math.floor(value + (255 - value) * percent / 100));
    return `rgb(${lightenValue(rgb.r)}, ${lightenValue(rgb.g)}, ${lightenValue(rgb.b)})`;
}

export function darken(color: string, percent: number): string {
    const rgb = hexToRgb(color);                                                                                        
    const darkenValue = (value: number) => Math.max(0, Math.floor(value * (1 - percent / 100)));
    return `rgb(${darkenValue(rgb.r)}, ${darkenValue(rgb.g)}, ${darkenValue(rgb.b)})`;
}

function hexToRgb(input: string): { r: number, g: number, b: number } {
    const rgbMatch = input.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10)
        };
    }

    const hexMatch = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(input);
    return hexMatch ? {
        r: parseInt(hexMatch[1], 16),
        g: parseInt(hexMatch[2], 16),
        b: parseInt(hexMatch[3], 16)
    } : { r: 0, g: 0, b: 0 };
}


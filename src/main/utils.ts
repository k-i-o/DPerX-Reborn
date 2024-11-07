import { BrowserWindow } from "electron";
import { IPlayer } from "../interfaces/IPlayer";
import { IVector2 } from "../interfaces/IVector2";
import { Server } from "./models/singletons/Server";

export function distance(a: IVector2, b: IVector2) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function getNearestToPlayer(maxDistance: number): IPlayer | undefined {
    const server = Server.getInstance();
    const localPlayer = server.localPlayer;
    if (!localPlayer) return undefined;
    
    let closestPlayer: IPlayer | undefined;
    let closestDist = maxDistance;
    
    for (const player of server.players) {
        if (player.gametick != 0 && player.id != localPlayer.id && !player.frozen) {
            const dist = distance(player.position, localPlayer.position);
            // console.log(player, localPlayer)
            
            if (dist > 0 && dist < closestDist) {
                closestDist = dist;
                closestPlayer = player;
            }
        }
    }
    
    return closestPlayer;
}

const scanCodeToKeyCodeMap = {
    1: 27,     // Escape
    2: 49,     // '1'
    3: 50,     // '2'
    4: 51,     // '3'
    5: 52,     // '4'
    6: 53,     // '5'
    7: 54,     // '6'
    8: 55,     // '7'
    9: 56,     // '8'
    10: 57,    // '9'
    11: 48,    // '0'
    12: 189,   // '-'
    13: 187,   // '='
    14: 8,     // Backspace
    15: 9,     // Tab
    16: 81,    // 'Q'
    17: 87,    // 'W'
    18: 69,    // 'E'
    19: 82,    // 'R'
    20: 84,    // 'T'
    21: 89,    // 'Y'
    22: 85,    // 'U'
    23: 73,    // 'I'
    24: 79,    // 'O'
    25: 80,    // 'P'
    26: 219,   // '['
    27: 221,   // ']'
    28: 13,    // Enter
    29: 17,    // Left Control (Ctrl)
    30: 65,    // 'A'
    31: 83,    // 'S'
    32: 68,    // 'D'
    33: 70,    // 'F'
    34: 71,    // 'G'
    35: 72,    // 'H'
    36: 74,    // 'J'
    37: 75,    // 'K'
    38: 76,    // 'L'
    39: 186,   // ';'
    40: 222,   // "'"
    41: 192,   // '`'
    42: 16,    // Left Shift
    43: 220,   // '\'
    44: 90,    // 'Z'
    45: 88,    // 'X'
    46: 67,    // 'C'
    47: 86,    // 'V'
    48: 66,    // 'B'
    49: 78,    // 'N'
    50: 77,    // 'M'
    51: 188,   // ','
    52: 190,   // '.'
    53: 191,   // '/'
    54: 16,    // Right Shift
    55: 106,   // Numpad '*'
    56: 18,    // Left Alt (Alt)
    57: 32,    // Spacebar
    58: 20,    // Caps Lock
    59: 112,   // F1
    60: 113,   // F2
    61: 114,   // F3
    62: 115,   // F4
    63: 116,   // F5
    64: 117,   // F6
    65: 118,   // F7
    66: 119,   // F8
    67: 120,   // F9
    68: 121,   // F10
    69: 144,   // Num Lock
    70: 145,   // Scroll Lock
    71: 103,   // Numpad '7'
    72: 104,   // Numpad '8'
    73: 105,   // Numpad '9'
    74: 109,   // Numpad '-'
    75: 100,   // Numpad '4'
    76: 101,   // Numpad '5'
    77: 102,   // Numpad '6'
    78: 107,   // Numpad '+'
    79: 97,    // Numpad '1'
    80: 98,    // Numpad '2'
    81: 99,    // Numpad '3'
    82: 96,    // Numpad '0'
    83: 110,   // Numpad '.'
    86: 226,   // International key '\'
    87: 122,   // F11
    88: 123,   // F12
    100: 103,  // F13 (depending on the keyboard)
    101: 104,  // F14
    102: 105,  // F15
    112: 96,   // Insert (same as Numpad '0')
    113: 36,   // Home
    114: 33,   // Page Up
    115: 46,   // Delete
    116: 35,   // End
    117: 34,   // Page Down
    118: 37,   // Arrow Left
    119: 38,   // Arrow Up
    120: 39,   // Arrow Right
    121: 40,   // Arrow Down
    125: 91,   // Left Windows (Super)
    126: 92,   // Right Windows (Super)
    127: 93,   // Context Menu
};

export function compareArrays(arr1: any[], arr2: any[]) {
    if(!arr1 || !arr2 || !arr1.length || !arr2.length) return false;

    const set1 = new Set(arr1);
    const set2 = new Set(arr2);

    if (set1.size !== set2.size) {
        return false;
    }

    for (const item of set1) {
        if (!set2.has(item)) {
            return false;
        }
    }

    return true;
}

export function convertScanCodeToKeyCode(scanCode: number): number {
    return scanCodeToKeyCodeMap[scanCode] || -1;
}

export function getHotkeys(cheat: any): number[] {
    return cheat.hotkeys ? cheat.hotkeys : [];
}

export function handleCheatToggle(
    cheat: any, 
    hotkeys: number[], 
    pressedKeys: number[], 
    window: BrowserWindow | null,
    getCategories: any
): void {
    if (!cheat.holdHotkeys && compareArrays(hotkeys, pressedKeys)) {
        cheat.enabled = !cheat.enabled;
        pressedKeys = []; 
        window?.webContents.send("cheatsUpdated", getCategories());
    } else if (cheat.holdHotkeys && compareArrays(hotkeys, pressedKeys)) {
        if (!cheat.enabled) {
            cheat.enabled = true;
            window?.webContents.send("cheatsUpdated", getCategories());
        }
    } else if (cheat.holdHotkeys && !compareArrays(hotkeys, pressedKeys)) {
        if (cheat.enabled) {
            cheat.enabled = false;
            window?.webContents.send("cheatsUpdated", getCategories());
        }
    }
}

export function rgbToHsl(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
  
    let h, s;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [h, s, l];
}  

export function hslToTwColor(hsl) {
    const h = Math.round(hsl[0] * 255);
    const s = Math.round(hsl[1] * 255);
    let l;
    
    if (hsl[2] === 0 || hsl[2] === 1) {
        l = Math.round(hsl[2] * 255);
    } else {
        l = Math.round(hsl[2] * 255 / 2);
    }
  
    const twColor = (h << 16) + (s << 8) + l;
    return twColor;
}

export function hexToTwColor(hex) {
    hex = hex.replace(/^#/, '');
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    const hsl = rgbToHsl([r, g, b]);
    const twColor = hslToTwColor(hsl);
    return twColor;
}

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

export function hexToRgb(hex: string): {r: number, g: number, b: number} {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {r: 0, g: 0, b: 0};
}
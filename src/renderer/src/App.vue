<script setup lang="ts">
// COMPONENTS
import Slider from 'primevue/slider';
import Checkbox from 'primevue/checkbox';
import ColorPicker from 'primevue/colorpicker';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';

// GENERAL IMPORTS
import { Ref, ref } from 'vue';
import { IMenuCheatCategory } from '../../interfaces/IMenuCheatCategory';
import { ISetting } from '../../interfaces/ISetting';
import { IMenuCheatItemComponent } from 'src/interfaces/IMenuCheatItemComponent';
import { adjustAlpha, darken, lighten, rgbToHex } from './utils';

(window as any).goto = (url: string) => {
    send('goto', url);
}

let gameAttached: Ref<boolean> = ref(false);
let offsetsList: any;
let categories: Ref<IMenuCheatCategory[]> = ref([]);
let settingsVisible: Ref<boolean> = ref(false);
let settings: Ref<ISetting[]> = ref([]);

let activeCategory: Ref<IMenuCheatCategory | undefined> = ref();
let activeSetting: Ref<{id:string,icon:string,options:any[]} | undefined> = ref();

const send = window.electron.ipcRenderer.send;
const on = window.electron.ipcRenderer.on;

const minimize = () => {
    window.electron.ipcRenderer.send('minimize');
}

const close = () => {
    window.electron.ipcRenderer.send('close');
}

const formatName = (str: string) => {
    let formatted = str.replace(/([a-z])([A-Z])/g, '$1 $2');
    
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

const toggleCheat = (type: string, status: boolean, needGame: boolean) => {
    send('enableCheat', {type, status, needGame});
};
const runCheat = (type: string, needGame: boolean) => {
    send('runCheat', {type, needGame});
};
const attach = () => {
    send('attach');
};
on('gameAttached', (_, attached: boolean) => {
    gameAttached.value = attached;
});

const updateValue = (cheatId: string, componentId: string, newValue: any) => {
    send('updateValue', { cheatId, componentId, newValue });
};

const selectCategory = (category: IMenuCheatCategory) => {
    activeCategory.value = category;
};
const selectSetting = (settingId: {id:string,icon:string,options:any[]}) => {
    activeSetting.value = settingId;
};

const enableListener = (cheatId: string, component: IMenuCheatItemComponent) => {
    let originalValue = { ...component.value }; 
    let keysPressed: {name: string, code: number}[] = []; 

    component.value = { 
        keyIds: [], 
        display: 'Listening...' 
    }; 

    const listener = (event: KeyboardEvent) => {        
        if (event.key === 'Escape') {
            keysPressed = []; 
            component.value = { 
                keyIds: originalValue.keyIds || [], 
                display: originalValue.display || '' 
            }; 
            document.removeEventListener('keydown', listener);
            return;
        }

        if (event.key === 'Enter') {
            originalValue = { ...component.value }; 
            keysPressed = []; 
            document.removeEventListener('keydown', listener); 
            send('newHotkeys', {cheatId, componentId: component.id, newValue: JSON.stringify(component.value.keyIds)});
            return; 
        }

        if (keysPressed.map(k=>k.code).includes(event.keyCode)) {
            return;
        }

        if (keysPressed.length >= 3) {
            keysPressed = []; 
        }

        keysPressed.push({name: event.key, code: event.keyCode});
        component.value = { 
            keyIds: keysPressed.map(k => k.code),
            display: keysPressed.map(k => k.name).join(' + ').toUpperCase() 
        };
    };

    document.addEventListener('keydown', listener);
};

const resetListener = (cheatId: string, component: IMenuCheatItemComponent) => {
    component.value = { 
        keyIds: [], 
        display: '' 
    }; 

    send('newHotkeys', {cheatId, componentId: component.id, newValue: JSON.stringify(component.value.keyIds)});

};

send('getCheatsAndOffsets');
on('getCheatsAndOffsetsResponse', (_, {cheats,offsets,profiles,currentProfile}) => {
    offsetsList = offsets;
    categories.value = cheats;

    activeCategory.value = categories.value[0];

    let offsetsOptions: any[] = [
        {
            id: 'reset all',
            type: 'button', 
            onChange: () => {
                send('resetOffsets');
            }
        },
        {
            id: 'save all',
            type: 'button', 
            onChange: () => {
                offsetsOptions.forEach(o => {
                    if(o.ids) {
                        send('updateOffset', { ids: o.ids, value: o.value });
                    }
                });
            }
        },
        {
            id: 'profiles',
            type: 'select', 
            value: {profileName:currentProfile??'DDNet'},
            list: profiles,
            onChange: ({profileName}) => {
                send('setNewProfile', profileName);
            }
        }
    ];
    
    offsetsOptions = offsetsOptions.concat(offsetsList.map(o=>{
        return {
            ids: o.ids,
            title: o.title,
            type: 'text', 
            value: o.value
        };  
    }));

    let rainbowEnabled = false;
    let rainbowSpeed = 100;
    let rainbowInterval: any = null;

    settings.value = [
        {
            id: 'Appearance',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-paint"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 2a3 3 0 0 1 2.995 2.824l.005 .176a3 3 0 0 1 3 3a6 6 0 0 1 -5.775 5.996l-.225 .004h-4l.15 .005a2 2 0 0 1 1.844 1.838l.006 .157v4a2 2 0 0 1 -1.85 1.995l-.15 .005h-2a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-4a2 2 0 0 1 1.85 -1.995l.15 -.005v-1a1 1 0 0 1 .883 -.993l.117 -.007h5a4 4 0 0 0 4 -4a1 1 0 0 0 -.883 -.993l-.117 -.007l-.005 .176a3 3 0 0 1 -2.819 2.819l-.176 .005h-10a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-2a3 3 0 0 1 2.824 -2.995l.176 -.005h10z" /></svg>',
            options: [
                {
                    id: 'reset colors',
                    type: 'button',
                    onChange: () => {
                        const root = document.documentElement;

                        if (rainbowInterval) {
                            clearInterval(rainbowInterval);
                        }

                        const properties: any = [];
                        for (let sheet of document.styleSheets) {
                            try {
                                for (let rule of sheet.cssRules) {
                                    if ((rule as any).selectorText === ':root') {
                                        for (let style of (rule as any).style) {
                                            if (style.startsWith('--c-')) {
                                                properties.push(style);
                                            }
                                        }
                                    }
                                }
                            } catch (e) {
                                console.error('Error: ', e);
                            }
                        }

                        properties.forEach(prop => {
                            root.style.removeProperty(prop);
                        });

                        settings.value[0].options[3].value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-accent').trim());
                        settings.value[0].options[4].value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-s').trim());
                        settings.value[0].options[5].value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-t').trim());
                        
                        activeSetting.value = settings.value.filter((s)=>s.id == activeSetting.value?.id)[0];
                    },
                },
                {
                    id: 'rainbow effect',
                    type: 'button',
                    onChange: () => {
                        rainbowEnabled = !rainbowEnabled;

                        const root = document.documentElement;
                        let hue = 0;

                        if (rainbowInterval) {
                            clearInterval(rainbowInterval);
                        }

                        if(!rainbowEnabled) return;

                        rainbowInterval = setInterval(() => {
                            hue = (hue + 1) % 360;
                            const color = `hsl(${hue}, 100%, 50%)`; 
                            root.style.setProperty('--c-accent', color);

                            root.style.setProperty('--c-accent-variant1', adjustAlpha(color, 0.9));
                            root.style.setProperty('--c-accent-variant2', adjustAlpha(color, 0.7));
                        }, rainbowSpeed);
                        
                    },
                },
                {
                    id: 'rainbow speed',
                    type: 'slider',
                    value: rainbowSpeed,
                    onChange: (newValue) => {
                        rainbowSpeed = newValue;

                        if (rainbowInterval) {
                            clearInterval(rainbowInterval);
                        }

                        if(!rainbowEnabled) return;

                        let hue = 0;
                        rainbowInterval = setInterval(() => {
                            hue = (hue + 1) % 360;
                            const color = `hsl(${hue}, 100%, 50%)`;
                            const root = document.documentElement;
                            root.style.setProperty('--c-accent', color);

                            root.style.setProperty('--c-accent-variant1', adjustAlpha(color, 0.9));
                            root.style.setProperty('--c-accent-variant2', adjustAlpha(color, 0.7));
                        }, rainbowSpeed);
                    }
                },
                {
                    id: 'main color',
                    type: 'color_picker',
                    value: rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-accent').trim()),
                    onChange: (value: any) => {
                        const root = document.documentElement;
                        const color = `#${value}`;
                        root.style.setProperty('--c-accent', color);

                        root.style.setProperty('--c-accent-variant1', adjustAlpha(color, 0.9));
                        root.style.setProperty('--c-accent-variant2', adjustAlpha(color, 0.7));
                    },
                },
                {
                    id: 'secondary color',
                    type: 'color_picker',
                    value: rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-s').trim()),
                    onChange: (value: any) => {
                        const root = document.documentElement;
                        const color = `#${value}`;
                        root.style.setProperty('--c-s', color);

                        root.style.setProperty('--c-s-variant1', adjustAlpha(color, 0.15));
                        root.style.setProperty('--c-s-variant2', adjustAlpha(color, 0.5));
                    },
                },
                {
                    id: 'tertiary color',
                    type: 'color_picker',
                    value: rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-t').trim()),
                    onChange: (value: any) => {
                        const root = document.documentElement;
                        const color = `#${value}`;
                        root.style.setProperty('--c-t', color);

                        console.log(adjustAlpha(lighten(color, 11), 0.9), lighten(color, 11), adjustAlpha(color, 0.9));

                        root.style.setProperty('--c-t-variant1', lighten(color, 6));
                        root.style.setProperty('--c-t-variant2', adjustAlpha(color, 0.8));
                        root.style.setProperty('--c-t-variant3', adjustAlpha(lighten(color, 11), 0.9));
                        root.style.setProperty('--c-t-variant4', lighten(color, 5));
                        root.style.setProperty('--c-t-variant5', darken(color, 5));
                    },
                }
            ]
        },
        {
            id: 'Offsets',
            icon: '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-binary-tree-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z" /><path d="M7 14a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z" /><path d="M21 14a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z" /><path d="M14 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0z" /><path d="M12 8v8" /><path d="M6.316 12.496l4.368 -4.992" /><path d="M17.684 12.496l-4.366 -4.99" /></svg>',
            options: offsetsOptions
        },
        {
            id: 'Credits',
            icon: '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-user-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" /><path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" /></svg>',
            options: [
                {
                    id: 'Credits',
                    type: 'description',
                    value: `By kiocode`
                },
                {
                    id: 'Credits',
                    type: 'description-html',
                    value: `<a href="#" onclick="window.goto('')">Youtube</a>`
                },
                {
                    id: 'Credits',
                    type: 'description-html',
                    value: `<a href="#" onclick="window.goto('https://discord.gg/DceN7MuHGu')">Discord</a>`
                },
                {
                    id: 'Credits',
                    type: 'description-html',
                    value: `<a href="#" onclick="window.goto('https://www.patreon.com/kiocode')">Patreon</a>`
                },
                {
                    id: 'Credits',
                    type: 'description-html',
                    value: `<a href="#" onclick="window.goto('https://github.com/k-i-o')">Github</a>`
                },
                
            ]
        }
    ];

    activeSetting.value = settings.value[0];
});

on('cheatsUpdated', (_, cheats) => {
    categories.value = cheats;
});
</script>

<template>
    <div class="container" v-if="!settingsVisible">

        <div class="categories">
            <button class="attach" v-on:click="attach()">
                <div class="icon">
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-plug-connected"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 12l5 5l-1.5 1.5a3.536 3.536 0 1 1 -5 -5l1.5 -1.5z" /><path d="M17 12l-5 -5l1.5 -1.5a3.536 3.536 0 1 1 5 5l-1.5 1.5z" /><path d="M3 21l2.5 -2.5" /><path d="M18.5 5.5l2.5 -2.5" /><path d="M10 11l-2 2" /><path d="M13 14l-2 2" /></svg>                
                </div>
                <span>
                    {{ !gameAttached ? 'attach' : 're-attach' }}
                </span>
            </button>

            <div class="horizontal-separator"></div>

            <div class="category" :class="activeCategory?.title == category.title ? 'active' : ''" v-on:click="selectCategory(category)" v-for="category in categories">
                <div class="active-bar"></div>
                <div class="icon" v-html="category.icon"></div><span class="title">{{ category.title }}</span>
            </div>
        </div>

        <div class="view" v-if="activeCategory">
            <div class="header">
                <div class="metadata">
                    <h1><b>{{ activeCategory.title }}</b></h1>
                    <p class="description">{{ activeCategory.description }}</p>
                </div>
                <div class="extra">
                    <div class="avatar" v-on:click="settingsVisible=true">
                        <div class="logo">
   
                            <svg class="layer1" version="1.0" xmlns="http://www.w3.org/2000/svg"
                            width="1930.000000pt" height="1967.000000pt" viewBox="0 0 1930.000000 1967.000000"
                            preserveAspectRatio="xMidYMid meet">

                            <g transform="translate(0.000000,1967.000000) scale(0.100000,-0.100000)"
                            fill="#000000" stroke="none">
                            <path d="M2698 19563 c-249 -531 -420 -1147 -483 -1743 -22 -210 -30 -542 -16
                            -682 18 -184 48 -283 150 -495 49 -104 101 -227 115 -276 97 -335 108 -799 41
                            -1672 -39 -503 -45 -659 -45 -1042 0 -424 10 -605 51 -883 54 -363 153 -638
                            279 -774 l56 -61 -1337 -1920 -1337 -1920 56 -2 c515 -21 795 -69 1007 -173
                            182 -88 265 -188 273 -330 7 -129 -41 -249 -175 -440 -90 -126 -302 -339 -418
                            -417 -246 -166 -494 -244 -778 -245 -88 0 -135 -4 -129 -10 32 -32 923 -116
                            1462 -138 529 -21 1329 -2 1830 45 l144 13 331 -197 c886 -531 1705 -983 2191
                            -1209 272 -127 431 -186 698 -259 230 -63 250 -71 257 -93 4 -14 76 -580 161
                            -1257 127 -1026 155 -1233 168 -1233 13 0 40 199 163 1181 l147 1181 304 755
                            c284 708 303 752 309 711 2 -24 112 -1160 243 -2525 202 -2094 241 -2483 254
                            -2483 13 0 42 284 188 1808 95 994 176 1820 179 1835 4 25 43 -33 304 -450
                            237 -380 303 -478 319 -478 16 0 82 98 319 478 261 417 300 475 304 450 3 -15
                            84 -841 179 -1835 146 -1524 175 -1808 188 -1808 13 0 52 389 254 2483 131
                            1365 241 2502 244 2525 4 41 26 -9 308 -711 l304 -755 147 -1181 c123 -982
                            150 -1181 163 -1181 13 0 41 207 168 1233 85 677 157 1243 161 1257 7 22 27
                            30 257 93 267 73 426 132 698 259 486 226 1305 678 2191 1209 l331 197 144
                            -13 c501 -47 1301 -66 1830 -45 526 21 1333 96 1423 132 46 18 30 24 -45 17
                            -199 -20 -469 37 -683 144 -261 130 -554 421 -694 687 -56 108 -74 178 -69
                            270 8 142 91 242 272 330 214 104 493 152 1008 173 l56 2 -1337 1920 -1337
                            1920 56 61 c122 132 219 394 274 744 42 261 56 501 56 917 0 379 -7 537 -45
                            1038 -67 873 -56 1337 41 1672 14 49 66 172 115 276 140 290 167 435 156 822
                            -21 704 -200 1448 -505 2098 -47 99 -53 107 -79 107 -15 -1 -322 -49 -680
                            -109 l-653 -107 -242 -240 c-134 -132 -1073 -1061 -2087 -2064 -1039 -1028
                            -1853 -1827 -1865 -1829 -11 -2 -318 18 -681 45 l-661 47 -655 -47 c-360 -26
                            -667 -46 -681 -44 -18 2 -536 508 -1869 1828 -1014 1003 -1953 1932 -2087
                            2064 l-242 240 -653 107 c-358 60 -665 108 -680 109 -26 0 -32 -8 -79 -107z
                            m242 -788 c116 -1007 462 -2037 953 -2840 292 -479 638 -908 1078 -1340 218
                            -214 371 -349 565 -501 111 -86 123 -98 133 -138 29 -117 5 -185 -82 -230 -49
                            -25 -66 -28 -144 -28 -48 0 -140 9 -203 20 -152 27 -229 34 -265 24 -25 -7
                            -30 -14 -33 -44 -3 -32 3 -40 61 -94 36 -33 116 -93 179 -134 116 -76 153
                            -114 165 -170 21 -107 -151 -137 -486 -84 -287 45 -456 25 -677 -81 -314 -151
                            -691 -514 -962 -927 -42 -64 -80 -117 -84 -117 -12 -1 -79 128 -124 238 -110
                            271 -183 633 -215 1059 -13 183 -7 841 10 1027 34 375 45 639 46 1070 0 465
                            -3 515 -46 743 -24 126 -46 201 -160 560 -123 385 -130 417 -136 692 -4 190
                            -2 255 16 415 34 298 115 687 212 1025 35 122 139 440 148 455 3 6 11 -87 18
                            -205 7 -118 22 -296 33 -395z m13553 420 c152 -466 253 -909 298 -1300 18
                            -160 20 -225 16 -415 -6 -275 -13 -307 -136 -692 -114 -359 -136 -434 -160
                            -560 -43 -228 -46 -278 -46 -743 1 -431 12 -695 46 -1070 17 -186 23 -844 10
                            -1027 -32 -426 -105 -788 -215 -1059 -45 -110 -112 -239 -124 -238 -4 0 -42
                            53 -84 117 -271 413 -648 776 -962 927 -221 106 -390 126 -677 81 -335 -53
                            -507 -23 -486 84 12 56 49 94 165 170 63 41 143 101 179 134 58 54 64 62 61
                            94 -3 30 -8 37 -33 44 -36 10 -113 3 -265 -24 -63 -11 -155 -20 -203 -20 -78
                            0 -95 3 -144 28 -87 45 -111 113 -82 230 10 40 22 52 133 138 365 285 797 710
                            1109 1091 529 646 892 1311 1163 2130 202 610 321 1229 356 1847 7 120 15 215
                            19 210 4 -4 32 -83 62 -177z m-9398 -8359 c237 -51 516 -161 760 -298 103 -59
                            390 -246 421 -276 15 -15 28 -59 53 -188 18 -93 93 -472 167 -843 74 -371 133
                            -676 131 -677 -1 -1 -74 176 -161 394 -87 218 -164 403 -170 410 -10 10 -24
                            10 -62 2 -70 -14 -316 -37 -546 -51 -151 -9 -237 -9 -363 0 -342 25 -525 74
                            -641 175 -43 37 -187 246 -301 439 -36 62 -69 115 -72 119 -7 8 -162 32 -466
                            73 -104 14 -254 35 -331 46 l-142 20 -133 -64 c-74 -36 -200 -97 -281 -136
                            -331 -160 -445 -214 -580 -280 -79 -37 -267 -128 -418 -201 -258 -125 -373
                            -180 -665 -320 -66 -32 -201 -97 -300 -145 -99 -48 -234 -113 -300 -145 -178
                            -86 -396 -191 -562 -271 -275 -133 -398 -190 -388 -181 6 5 264 150 575 322
                            311 172 833 462 1160 645 327 182 712 396 855 475 143 79 409 227 590 328 382
                            214 524 286 725 370 379 157 691 246 1010 286 93 11 318 -3 435 -28z m5720 4
                            c265 -46 532 -128 855 -262 201 -84 343 -156 725 -370 182 -101 447 -249 590
                            -328 143 -79 528 -293 855 -475 327 -183 849 -473 1160 -645 311 -172 570
                            -317 575 -322 10 -9 -114 49 -385 180 -158 76 -376 181 -565 272 -66 32 -201
                            97 -300 145 -99 48 -234 113 -300 145 -292 140 -407 195 -665 320 -151 73
                            -338 163 -415 200 -142 68 -313 151 -582 281 -82 39 -208 100 -282 136 l-133
                            64 -142 -20 c-77 -11 -226 -32 -331 -46 -304 -41 -459 -65 -466 -73 -3 -4 -36
                            -57 -72 -119 -114 -193 -258 -402 -301 -439 -116 -101 -299 -150 -641 -175
                            -126 -9 -212 -9 -363 0 -230 14 -476 37 -546 51 -38 8 -52 8 -62 -2 -6 -7 -83
                            -192 -170 -410 -87 -218 -160 -395 -161 -394 -2 1 57 306 131 677 74 371 149
                            750 167 843 25 129 38 173 53 188 31 30 318 217 421 276 293 166 605 277 910
                            326 67 10 325 -3 440 -24z"/>
                            </g>
                            </svg>

                            <svg class="layer2" version="1.0" xmlns="http://www.w3.org/2000/svg"
                            width="1930.000000pt" height="1967.000000pt" viewBox="0 0 1930.000000 1967.000000"
                            preserveAspectRatio="xMidYMid meet">

                                <g transform="translate(0.000000,1967.000000) scale(0.100000,-0.100000)"
                                fill="#000000" stroke="none">
                                <path d="M2865 19388 c-21 -52 -121 -374 -166 -535 -131 -475 -197 -871 -206
                                -1238 -9 -348 4 -429 143 -862 136 -427 167 -558 195 -818 26 -241 10 -878
                                -37 -1465 -22 -272 -29 -832 -15 -1060 19 -296 55 -545 112 -775 58 -237 199
                                -567 244 -572 15 -2 39 25 102 121 230 345 555 683 815 849 268 170 492 218
                                781 165 168 -31 424 -33 477 -4 46 25 59 44 60 86 0 70 -36 119 -138 186 -119
                                79 -238 172 -258 202 -40 61 16 71 217 38 367 -61 509 -16 509 162 0 32 -7 81
                                -15 108 -12 41 -24 57 -62 85 -253 181 -699 596 -979 912 -580 651 -977 1310
                                -1277 2117 -255 685 -417 1467 -442 2133 -4 84 -8 162 -11 175 -6 32 -33 27
                                -49 -10z"/>
                                <path d="M16406 19398 c-3 -13 -7 -91 -11 -175 -25 -666 -187 -1448 -442
                                -2133 -300 -807 -697 -1466 -1277 -2117 -280 -316 -726 -731 -979 -912 -38
                                -28 -50 -44 -62 -85 -8 -27 -15 -76 -15 -108 0 -178 142 -223 509 -162 201 33
                                257 23 217 -38 -20 -30 -139 -123 -258 -202 -102 -67 -138 -116 -138 -186 1
                                -42 14 -61 60 -86 53 -29 309 -27 477 4 251 46 428 20 653 -93 172 -86 305
                                -188 501 -384 169 -169 312 -342 442 -537 63 -96 87 -123 102 -121 45 5 186
                                335 244 572 57 230 93 479 112 775 14 228 7 788 -15 1060 -47 587 -63 1224
                                -37 1465 28 260 59 391 195 818 130 406 146 492 146 777 0 328 -50 685 -155
                                1115 -85 345 -220 768 -247 773 -11 2 -19 -5 -22 -20z"/>
                                <path d="M6680 10884 c-328 -30 -716 -142 -1150 -332 -169 -74 -235 -109
                                -1155 -622 -462 -257 -1063 -591 -1335 -742 -272 -151 -688 -383 -925 -515
                                -236 -131 -492 -273 -567 -314 -76 -40 -138 -80 -138 -86 0 -29 20 -21 335
                                132 121 59 265 129 320 155 55 26 190 92 300 145 110 54 236 114 280 135 44
                                21 161 77 260 125 99 48 234 113 300 145 66 32 188 90 270 130 83 40 209 101
                                280 135 72 34 195 94 275 132 152 74 842 406 1164 562 l189 91 136 -20 c186
                                -26 468 -65 630 -86 73 -9 137 -22 142 -28 5 -6 44 -69 87 -141 123 -206 252
                                -394 293 -426 86 -68 218 -115 404 -145 225 -35 735 -28 1069 15 l138 17 8
                                -20 c40 -101 333 -836 340 -853 8 -19 40 -34 40 -18 0 5 -129 654 -275 1390
                                -80 403 -85 421 -112 443 -61 50 -264 183 -373 244 -311 176 -563 275 -835
                                328 -107 20 -302 32 -395 24z"/>
                                <path d="M12390 10884 c-318 -40 -623 -150 -980 -352 -109 -61 -312 -194 -373
                                -244 -27 -22 -32 -40 -112 -443 -146 -736 -275 -1385 -275 -1390 0 -16 32 -1
                                40 18 7 17 300 752 340 853 l8 20 138 -17 c334 -43 844 -50 1069 -15 186 30
                                318 77 404 145 41 32 170 220 293 426 43 72 82 135 87 141 5 6 69 19 142 28
                                162 21 444 60 630 86 l136 20 189 -91 c322 -156 1012 -488 1164 -562 80 -38
                                204 -98 275 -132 72 -34 198 -95 280 -135 83 -40 204 -98 270 -130 66 -32 201
                                -97 300 -145 99 -48 216 -104 260 -125 44 -21 170 -81 280 -135 110 -53 245
                                -119 300 -145 55 -26 199 -96 320 -155 315 -153 335 -161 335 -132 0 6 -62 46
                                -138 86 -75 41 -330 183 -567 314 -236 132 -653 364 -925 515 -272 151 -873
                                485 -1335 742 -920 513 -986 548 -1155 622 -368 161 -688 262 -973 308 -124
                                20 -356 33 -427 24z"/>
                                <path d="M6 6481 c5 -5 128 -66 274 -136 1267 -609 2429 -1234 2951 -1587 250
                                -169 409 -317 409 -382 0 -31 -83 -102 -168 -145 -204 -102 -542 -165 -967
                                -179 -190 -7 -199 -8 -175 -23 39 -26 7202 -3965 7273 -4000 63 -31 64 -32 83
                                -13 11 11 1650 916 3644 2013 1994 1097 3631 1999 3638 2006 10 9 -31 13 -190
                                18 -523 15 -929 113 -1084 262 -40 38 -45 48 -40 71 46 183 722 616 2001 1282
                                281 146 1099 554 1424 711 117 56 211 104 209 106 -2 2 -46 -3 -98 -10 -122
                                -18 -408 -50 -625 -70 -790 -72 -1775 -72 -2547 0 l-156 15 -349 -209 c-749
                                -447 -1448 -838 -1939 -1084 -366 -183 -603 -284 -793 -337 -58 -16 -170 -47
                                -249 -68 -79 -22 -145 -42 -147 -44 -3 -2 -73 -554 -157 -1226 -84 -672 -155
                                -1222 -158 -1222 -3 0 -69 516 -148 1148 l-143 1147 -306 763 c-252 629 -309
                                762 -324 762 -15 0 -19 -8 -19 -32 -2 -78 -478 -4952 -483 -4938 -4 12 -348
                                3566 -347 3593 1 42 -72 -64 -331 -478 -166 -267 -305 -485 -309 -485 -4 0
                                -143 218 -309 485 -167 267 -310 485 -317 485 -8 0 -14 -10 -14 -22 -2 -76
                                -348 -3590 -353 -3578 -5 14 -478 4916 -477 4953 0 10 -7 17 -19 17 -15 0 -72
                                -133 -324 -762 l-306 -763 -143 -1147 c-79 -632 -145 -1148 -148 -1148 -3 0
                                -74 550 -158 1222 -84 672 -154 1224 -157 1226 -2 2 -68 22 -147 44 -79 21
                                -191 52 -249 68 -190 53 -427 154 -793 337 -491 246 -1190 637 -1939 1084
                                l-349 209 -156 -15 c-528 -49 -1354 -69 -1872 -45 -418 19 -910 62 -1265 110
                                -174 23 -172 23 -159 11z"/>
                                </g>
                            </svg>
                        </div>
                        <div class="settings-icon">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-settings"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>                        
                        </div>
                    </div>
                </div>
            </div>

            <div class="options">

                <div class="option noavaiable" v-if="activeCategory.items.length==0">
                    No Cheat Avaiable There
                </div>
    
                <div class="option" v-for="item in activeCategory.items">
                    <div class="toggle" v-if="item.type == 'toggle' && item.enabled != undefined" :title="!gameAttached ? 'Disabled because the game isn\'t attached' : 'Enable the cheat'">
                        <Checkbox v-model="item.enabled" :disabled="!gameAttached" v-on:change="toggleCheat(item.id, item.enabled, item.needGame)" :binary="true" />
                        <span>{{item.title}}</span>
                    </div>

                    <div class="run" v-if="item.type == 'run'">
                        <span>{{item.title}}</span>
                        <button class="execute" v-on:click="runCheat(item.id, item.needGame)">
                            Execute
                        </button>
                    </div>

                    <!-- <div class="separator-container">
                        <div class="horizontal-separator" v-if="item.components.length > 0"></div>
                    </div> -->

                    <div class="components" v-if="item.components.length > 0">
                        <div class="component" v-for="component in item.components">
                            <div class="toggle-component" v-if="component.type == 'toggle'">
                                <div class="input">
                                    <Checkbox v-model="component.value" v-on:change="updateValue(item.id, component.id, component.value)" :binary="true" />
                                </div>
                                <span>
                                    {{ formatName(component.id) }}
                                </span>
                            </div>
                            <div class="slider-component" v-if="component.type == 'slider'">
                                <span>
                                    {{ formatName(component.id) }} - {{ component.value }}
                                </span>
                                <div class="input slider">
                                    <Slider v-model="component.value" v-on:change="updateValue(item.id, component.id, component.value)" min=0 max=999 />
                                </div>
                            </div>
                            <div class="listener-component" v-if="component.type == 'listener'">
                                <span>
                                    {{ formatName(component.id) }} (Enter to confirm)
                                </span>
                                <div class="input listener">
                                    <button v-on:click="enableListener(item.id, component)" @contextmenu.prevent="resetListener(item.id, component)" @keydown.enter.prevent title="Left-Click to start listener and Right-Click to reset keys">{{ component.value.display || "Left-Click to start" }}</button>
                                </div>
                            </div>
                            <div class="text-component" v-if="component.type == 'text'">
                                <span>{{ formatName(component.id) }}</span>
                                <InputText type="text" v-model="component.value" v-on:input="updateValue(item.id, component.id, component.value)" />
                            </div>
                            <div class="colorpicker-component" v-if="component.type == 'color_picker'">
                                <div class="input colorpicker">
                                    <ColorPicker v-model="component.value" v-on:change="updateValue(item.id, component.id, component.value)" format="hex" />
                                </div>
                                <span>
                                    {{ component.id[0].toUpperCase() + component.id.slice(1) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
    
            </div>
        </div>
            
        <!-- <div class="players-list">
            Online players: {{ players.length }}
            <ul class="players">
                <li v-for="p in players" :key="p.id">
                    <span>{{ p.id }}</span>
                    <span>{{ p.gametick }}</span>
                    <span>{{ p.position }}</span>
                    <span>{{ p.frozen }}</span>
                </li>
            </ul>
        </div> -->
    </div>
    <div class="container" v-if="settingsVisible">
        
        <div class="settings">
            <div class="setting-page-icon">
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-settings"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>                        
            </div>
            <h1 class="setting-title">Settings</h1>

            <div class="horizontal-separator"></div>

            <div class="setting" :class="activeSetting?.id == setting.id ? 'active' : ''" v-on:click="selectSetting(setting)" v-for="setting in settings">
                <div class="active-bar"></div>
                <div class="icon" v-html="setting.icon"></div>
                <span class="title">{{ setting.id }}</span>
            </div>
        </div>

        <div class="settings-view">
            <div class="top-header">
                <div class="back" v-on:click="settingsVisible=false">
                    <svg style="transform: translateX(-1px);width: 30px;height: 30px;" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>
                </div>

                <div class="window-options">
                    <div class="minimize" v-on:click="minimize()">
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-minus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /></svg>
                    </div>
                    <div class="close" v-on:click="close()">
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                    </div>
                </div>
            </div>

            <div class="settings-options" v-if="activeSetting && activeSetting?.options.length > 0">
                <div class="settings-option" v-for="option in activeSetting.options">
                    <button class="button-component" v-if="option.type == 'button'" v-on:click="option.onChange()">
                        <span>
                            {{ option.id[0].toUpperCase() + option.id.slice(1) }}
                        </span>
                    </button>
                    <div class="slider-component" v-if="option.type == 'slider'">
                        <span>
                            {{ option.id[0].toUpperCase() + option.id.slice(1) }} - {{ option.value }}
                        </span>
                        <div class="input slider">
                            <Slider v-model="option.value" v-on:change="option.onChange(option.value)" min=0 max=200 />
                        </div>
                    </div>
                    <div class="select-component" v-if="option.type == 'select'">
                        <span>{{ option.id[0].toUpperCase() + option.id.slice(1) }}</span>
                        <Select v-model="option.value" :options="option.list" v-on:change="option.onChange(option.value)" optionLabel="profileName" placeholder="Select a profile" class="w-full md:w-56" />
                    </div>
                    <div class="colorpicker-component" v-if="option.type == 'color_picker'">
                        <span>
                            {{ option.id[0].toUpperCase() + option.id.slice(1) }}
                        </span>
                        <div class="input colorpicker">
                            <ColorPicker v-model="option.value" v-on:change="option.onChange(option.value)" format="hex" />
                        </div>
                    </div>
                    <div class="description-component" v-if="option.type == 'description'">
                        {{ option.value }}
                    </div>
                    <div class="description-component" v-if="option.type == 'description-html'" v-html="option.value"></div>
                    <div class="text-component" v-if="option.type == 'text'">
                        <span>{{ option.title }}</span>
                        <InputText type="text" v-model="option.value" />
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

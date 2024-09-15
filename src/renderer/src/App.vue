<script setup lang="ts">
// COMPONENTS
import Slider from 'primevue/slider';
import Checkbox from 'primevue/checkbox';
import ColorPicker from 'primevue/colorpicker';
import InputText from 'primevue/inputtext';

// GENERAL IMPORTS
import { Ref, ref } from 'vue';
import { IMenuCheatCategory } from '../../interfaces/IMenuCheatCategory';
import { ISetting } from '../../interfaces/ISetting';
import { IMenuCheatItemComponent } from 'src/interfaces/IMenuCheatItemComponent';
import { title } from 'process';

let offsetsList: any;
let categories: Ref<IMenuCheatCategory[]> = ref([]);
let activeCategory: Ref<IMenuCheatCategory | undefined> = ref();
let settingsVisible: Ref<boolean> = ref(false);
let settings: Ref<ISetting[]> = ref([]);
let activeSetting: Ref<{id:string,icon:string,options:any[]} | undefined> = ref();

    
function rgbToHex(color: string) {
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

const send = window.electron.ipcRenderer.send;

const minimize = () => {
    window.electron.ipcRenderer.send('minimize');
}

const close = () => {
    window.electron.ipcRenderer.send('close');
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

send('getCheatsAndOffsets');
window.electron.ipcRenderer.on('getCheatsAndOffsetsResponse', (_, {cheats,offsets}) => {
    offsetsList = offsets;
    categories.value = cheats;
    activeCategory.value = categories.value[0];

    let offsetsOptions = offsetsList.map(o=>{
        return {
            ids: o.ids,
            title: o.title,
            type: 'text', 
            value: o.value
        };  
    });

    offsetsOptions.push({
        id: 'reset',
        type: 'button', 
        onChange: () => {
            offsetsOptions.forEach(o => {
                // if(o.ids) {
                //     send('updateOffset', { ids: o.ids, value: o.value });
                // }
            });
        }
    });

    offsetsOptions.push({
        id: 'save',
        type: 'button', 
        onChange: () => {
            offsetsOptions.forEach(o => {
                if(o.ids) {
                    send('updateOffset', { ids: o.ids, value: o.value });
                }
            });
        }
    });
        
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

                        const properties = [
                            '--c-accent',
                            '--c-accent-variant',
                            '--c-accent-variant2',
                            '--c-s',
                            '--c-s-variant',
                            '--c-s-variant2',
                            '--c-t',
                            '--c-t-variant',
                            '--c-t-variant2',
                            '--c-t-variant3',
                            '--c-t-variant4'
                        ];

                        properties.forEach(prop => {
                            root.style.removeProperty(prop);
                        });

                        settings.value[0].options[1].value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-accent').trim());
                        settings.value[0].options[2].value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-accent-variant').trim());
                        settings.value[0].options[3].value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-accent-variant2').trim());
                        settings.value[0].options[4].value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-s').trim());
                        settings.value[0].options[5].value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-s-variant').trim());
                        settings.value[0].options[6].value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-s-variant2').trim());
                        settings.value[0].options[7].value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-t').trim());
                        settings.value[0].options[8].value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-t-variant').trim());
                        settings.value[0].options[9].value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-t-variant2').trim());
                        settings.value[0].options[10].value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-t-variant3').trim());
                        settings.value[0].options[11].value = rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-t-variant4').trim()); 
                        
                        activeSetting.value = settings.value.filter((s)=>s.id == activeSetting.value?.id)[0];
                    },
                },
                {
                    id: 'main color 1',
                    type: 'color_picker',
                    value: rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-accent').trim()),
                    onChange: (value: any) => {
                        const color = `#${value}`;
                        const root = document.documentElement;
                        root.style.setProperty('--c-accent', color);
                    },
                },
                {
                    id: 'main color 2',
                    type: 'color_picker',
                    value: rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-accent-variant').trim()),
                    onChange: (value: any) => {
                        const color = `#${value}`;
                        const root = document.documentElement;
                        root.style.setProperty('--c-accent-variant', color);
                    },
                },
                {
                    id: 'main color 3',
                    type: 'color_picker',
                    value: rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-accent-variant2').trim()),
                    onChange: (value: any) => {
                        const color = `#${value}`;
                        const root = document.documentElement;
                        root.style.setProperty('--c-accent-variant2', color);
                    },
                },
                {
                    id: 'secondary color 1',
                    type: 'color_picker',
                    value: rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-s').trim()),
                    onChange: (value: any) => {
                        const color = `#${value}`;
                        const root = document.documentElement;
                        root.style.setProperty('--c-s', color);
                    },
                },
                {
                    id: 'secondary color 2',
                    type: 'color_picker',
                    value: rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-s-variant').trim()),
                    onChange: (value: any) => {
                        const color = `#${value}`;
                        const root = document.documentElement;
                        root.style.setProperty('--c-s-variant', color);
                    },
                },
                {
                    id: 'secondary color 3',
                    type: 'color_picker',
                    value: rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-s-variant2').trim()),
                    onChange: (value: any) => {
                        const color = `#${value}`;
                        const root = document.documentElement;
                        root.style.setProperty('--c-s-variant2', color);
                    },
                },
                {
                    id: 'tertiary color 1',
                    type: 'color_picker',
                    value: rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-t').trim()),
                    onChange: (value: any) => {
                        const color = `#${value}`;
                        const root = document.documentElement;
                        root.style.setProperty('--c-t', color);
                    },
                },
                {
                    id: 'tertiary color 2',
                    type: 'color_picker',
                    value: rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-t-variant').trim()),
                    onChange: (value: any) => {
                        const color = `#${value}`;
                        const root = document.documentElement;
                        root.style.setProperty('--c-t-variant', color);
                    },
                },
                {
                    id: 'tertiary color 3',
                    type: 'color_picker',
                    value: rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-t-variant2').trim()),
                    onChange: (value: any) => {
                        const color = `#${value}`;
                        const root = document.documentElement;
                        root.style.setProperty('--c-t-variant2', color);
                    },
                },
                {
                    id: 'tertiary color 4',
                    type: 'color_picker',
                    value: rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-t-variant3').trim()),
                    onChange: (value: any) => {
                        const color = `#${value}`;
                        const root = document.documentElement;
                        root.style.setProperty('--c-t-variant3', color);
                    },
                },
                {
                    id: 'tertiary color 5',
                    type: 'color_picker',
                    value: rgbToHex(getComputedStyle(document.documentElement).getPropertyValue('--c-t-variant4').trim()),
                    onChange: (value: any) => {
                        const color = `#${value}`;
                        const root = document.documentElement;
                        root.style.setProperty('--c-t-variant4', color);
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
                }
            ]
        }
    ];

    activeSetting.value = settings.value[0];

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
                    attach
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
                        <img src="https://64.media.tumblr.com/e8d41958fee1413a229edb12df24ffd0/cf9029f6ab45e8f7-d8/s400x600/4e140bf9fb3184a9e385f998154a0b7018107562.jpg" alt="avatar">
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
                    <div class="toggle" v-if="item.type == 'toggle' && item.enabled != undefined">
                        <Checkbox v-model="item.enabled" v-on:change="toggleCheat(item.id, item.enabled, item.needGame)" :binary="true" />
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
                                    {{ component.id[0].toUpperCase() + component.id.slice(1) }}
                                </span>
                            </div>
                            <div class="slider-component" v-if="component.type == 'slider'">
                                <span>
                                    {{ component.id[0].toUpperCase() + component.id.slice(1) }} - {{ component.value }}
                                </span>
                                <div class="input slider">
                                    <Slider v-model="component.value" v-on:change="updateValue(item.id, component.id, component.value)" min=0 max=999 />
                                </div>
                            </div>
                            <div class="listener-component" v-if="component.type == 'listener'">
                                <span>
                                    {{ component.id[0].toUpperCase() + component.id.slice(1) }} (Enter to confirm)
                                </span>
                                <div class="input listener">
                                    <button v-on:click="enableListener(item.id, component)" @keydown.enter.prevent>{{ component.value.display || "Click to start listener" }}</button>
                                </div>
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
                    <div class="text-component" v-if="option.type == 'text'">
                        <span>{{ option.title }}</span>
                        <InputText type="text" v-model="option.value" />
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

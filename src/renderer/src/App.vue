<script setup lang="ts">
// COMPONENTS
import Slider from 'primevue/slider';
import Checkbox from 'primevue/checkbox';

// GENERAL IMPORTS
import { Ref, ref } from 'vue';
import { IMenuCheatCategory } from '../../interfaces/IMenuCheatCategory';

let categories: Ref<IMenuCheatCategory[]> = ref([]);
let activeCategory: Ref<IMenuCheatCategory | undefined> = ref();

const send = window.electron.ipcRenderer.send;

const enableCheat = (type: string, status: boolean) => {
    send('enableCheat', {type, status});
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

send('getCheats');
window.electron.ipcRenderer.on('getCheatsResponse', (_, data: IMenuCheatCategory[]) => {
    categories.value = data;
    activeCategory.value = categories.value[0];
});
</script>

<template>
    <div class="container">

        <div class="categories">
            <button class="attach" @click="attach()">
                <div class="icon">
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-circles-relation"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9.183 6.117a6 6 0 1 0 4.511 3.986" /><path d="M14.813 17.883a6 6 0 1 0 -4.496 -3.954" /></svg>
                </div>
                Attach process
            </button>

            <div class="horizontal-separator"></div>

            <div class="category" :class="activeCategory?.title == category.title ? 'active' : ''" @click="selectCategory(category)" v-for="category in categories">
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
                    <div class="avatar">
                        <img src="https://64.media.tumblr.com/e8d41958fee1413a229edb12df24ffd0/cf9029f6ab45e8f7-d8/s400x600/4e140bf9fb3184a9e385f998154a0b7018107562.jpg" alt="avatar">
                        <div class="settings-icon">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-settings"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /></svg>                        
                        </div>
                    </div>
                </div>
            </div>

            <div class="options">
    
                <div class="option" v-for="item in activeCategory.items">
                    <div class="toggle">
                        <Checkbox v-model="item.enabled" @change="enableCheat(item.id, item.enabled)" :binary="true" />
                        <span>{{item.title}}</span>
                    </div>

                    <div class="components" v-if="item.components.length > 0">
                        <div class="component" v-for="component in item.components">
                            {{ component.id }} - {{ component.value }}
                            
                            <div class="input" v-if="component.type == 'slider'">
                                <Slider v-model="component.value" @change="updateValue(item.id, component.id, component.value)" min="0" max="999" />
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
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import Slider from 'primevue/slider';
import InputText from 'primevue/inputtext';

let cheats: Ref<{ id: string, displayName: string, components?: [{ name: string, type: string, value: any }] }[]> = ref([]);

const enableCheat = (type: string) => {
    window.electron.ipcRenderer.send('enableCheat', type);
};

const attach = () => {
    window.electron.ipcRenderer.send('attach');
};

const updateValue = (cheatId: string, componentName: string, newValue: any) => {
    window.electron.ipcRenderer.send('updateValue', { cheatId, componentName, newValue });
};

window.electron.ipcRenderer.send('getCheats');
window.electron.ipcRenderer.on('getCheatsResponse', (_, data: { id: string, displayName: string }[]) => {
    cheats.value = data;
});
</script>

<template>
    <div class="container">
        <div class="buttons">
            <a target="_blank" rel="noreferrer" @click="attach()">Attach process</a>

            <div v-for="c in cheats" :key="c.id">
                <a @click="enableCheat(c.id)">{{c.displayName}}</a>
                <div v-for="component in c.components" :key="component.name">
                    {{ component.name }}

                    <div v-if="component.type == 'slider'">
                        <InputText v-model.number="component.value" @change="updateValue(c.id, component.name, component.value)" min="0" max="999" />
                        <Slider v-model="component.value" @change="updateValue(c.id, component.name, component.value)" min="0" max="999" />
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
    </div>
</template>

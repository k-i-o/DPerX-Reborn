<script setup lang="ts">
import { ref } from 'vue';
import { IPlayer } from './models/IPlayer';

const enableCheat = (type: string) => {
    window.electron.ipcRenderer.send('enableCheat', type);
}

const attach = () => {
    window.electron.ipcRenderer.send('attach');
}

const players = ref<IPlayer[]>([]);

setInterval(() => {
    window.electron.ipcRenderer.send('getOnlinePlayers');
}, 2000);

window.electron.ipcRenderer.on('onlinePlayersResponse', (_, data: IPlayer[]) => {
    players.value = data;
    console.log(players.value.length);
}); 
</script>

<template>
    <div class="container">
        <div class="buttons">
            <a target="_blank" rel="noreferrer" @click="attach()">Attach process</a>
            <a target="_blank" rel="noreferrer" @click="enableCheat('aimbot')">Enable aimbot</a>
            <a target="_blank" rel="noreferrer" @click="enableCheat('balancer')">Enable balancer</a>
            <a target="_blank" rel="noreferrer" @click="enableCheat('spinbot')">Enable spinbot</a>
            <a target="_blank" rel="noreferrer" @click="enableCheat('esp_box')">Enable esp box</a>
            <a target="_blank" rel="noreferrer" @click="enableCheat('esp_snapline')">Enable esp snapline</a>
            <a target="_blank" rel="noreferrer" @click="enableCheat('spoofer')">Run spoofer</a>
            <a target="_blank" rel="noreferrer" @click="enableCheat('bot_attack')">Run bot attack</a>
            <a target="_blank" rel="noreferrer" @click="enableCheat('join_bot')">Make join a bot</a>
        </div>
        <div class="players-list">
            Online players: {{ players.length }}
            <ul class="players">
                <li v-for="p in players" :key="p.id">
                    <span>{{ p.id }}</span>
                    <span>{{ p.gametick }}</span>
                    <span>{{ p.position }}</span>
                    <span>{{ p.frozen }}</span>
                </li>
            </ul>
        </div>
    </div>

</template>

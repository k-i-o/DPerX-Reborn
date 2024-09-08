<script setup lang="ts">
const enableCheat = (type: string) => {
    window.electron.ipcRenderer.send('enableCheat', type);
}

const attach = () => {
    window.electron.ipcRenderer.send('attach');
}
</script>

<template>
    <div class="container">
        <a target="_blank" rel="noreferrer" @click="attach()">Attach process</a>
        <a target="_blank" rel="noreferrer" @click="enableCheat('aimbot')">Enable aimbot</a>
        <a target="_blank" rel="noreferrer" @click="enableCheat('balancer')">Enable balancer</a>
        <a target="_blank" rel="noreferrer" @click="enableCheat('spinbot')">Enable spinbot</a>
        <a target="_blank" rel="noreferrer" @click="enableCheat('esp_box')">Enable esp box</a>
        <a target="_blank" rel="noreferrer" @click="enableCheat('esp_snapline')">Enable esp snapline</a>
        <a target="_blank" rel="noreferrer" @click="enableCheat('spoofer')">Run spoofer</a>
        <a target="_blank" rel="noreferrer" @click="enableCheat('botattack')">Run bot attack</a>
        <a target="_blank" rel="noreferrer" @click="enableCheat('joinabot')">Make join a bot</a>
    </div>
</template>

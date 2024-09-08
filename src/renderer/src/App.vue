<script setup lang="ts">
const enableCheat = (type: string) => {
    window.electron.ipcRenderer.send('enableCheat', type)
}

const attachProcess = () => {
    window.electron.ipcRenderer.send('createSession', "DDNet.exe")
}

</script>

<template>
    <a target="_blank" rel="noreferrer" @click="attachProcess()">Attach DDNet</a>
    <a target="_blank" rel="noreferrer" @click="enableCheat('spinbot')">Enable Spinbot</a>
</template>

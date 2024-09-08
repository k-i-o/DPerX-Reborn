import { ipcMain } from 'electron';
import { Variables } from './variables';
import {  openProcess, PTR, readMemory } from '../../IOMemoryUtility/memoryjs';
import { Notification } from 'electron/main';
import { offsets } from './offsets';

export function updater(variables: Variables) {

    let time = Date.now();
    let delta = 0;

    setInterval(() => { // INFINITE UPDATE LOOP
        if(!variables.system.gameAttached) return;
        if(!variables.system.handle || !variables.system.baseClientAddr || !variables.system.baseServerAddr) return;

        const now = Date.now();  
        delta = now - time;       
        time = now;      

        if(variables.spinbot.enabled) {
            variables.spinbot.execute();
        }

        if(variables.aimbot.enabled) {
            variables.aimbot.execute();
        }

        if(variables.balancer.enabled) {
            variables.balancer.execute();
        } 
        // else if (variables.balancer.needReset) {
        //     variables.balancer.resetWalk();
        // }

    }, 10);
}

export function ipcListeners(variables: Variables) {

    ipcMain.on('attach', (_) => {

        if(variables.system.gameAttached) {
            console.log("Game already attached");
            return;
        }

        const DDNetClient = "DDNet.exe"; // "DDPer.exe";

        try {
            const proc = openProcess(DDNetClient);
            variables.system.handle = proc.handle;
            const base = BigInt(proc.modBaseAddr);

            variables.system.baseServerAddr = readMemory(variables.system.handle, base + offsets.staticServerAddr, PTR);
            variables.system.baseClientAddr = readMemory(variables.system.handle, base + offsets.staticClientAddr, PTR);

            variables.system.gameAttached = true;
            console.log("Game attached");

            new Notification({ title: 'Game attached', body: 'Game attached successfully' }).show();

        } catch(e: any) {
            if(e.message == 'unable to find process') {
                variables.system.gameAttached = false;
                console.log("Game attaching failed");
            } else {
                throw e;
            }
        }

    });

    ipcMain.on('enableCheat', async (_, type) => {

        if(!variables.system.gameAttached) {
            console.log("No game attached");
            return;
        }

        console.debug("Toggling", type);

        try {
            switch (type) {
                case "spinbot":
                    variables.spinbot.enabled = !variables.spinbot.enabled;
                    break;

                case "aimbot":
                    variables.aimbot.enabled = !variables.aimbot.enabled;

                    break;

                case "balancer": 
                    variables.balancer.enabled = !variables.balancer.enabled;

                    break;

                default:
                    console.log("Unknown type");
            }
        } catch (error) {
            console.error("Error enabling cheat:", error);
        }
    });
}

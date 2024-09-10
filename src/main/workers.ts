import { ipcMain } from 'electron';
import {  openProcess, PTR, readMemory } from '../../IOMemoryUtility/memoryjs';
import { Notification } from 'electron/main';
import { offsets } from './offsets';
import { Server } from './models/singletons/Server';
import { Variables } from './models/singletons/Variables';


export function updater() {

    let time = Date.now();
    let delta = 0;

    setInterval(() => { // INFINITE UPDATE LOOP
        if(!Variables.getInstance().system.gameAttached) return;
        if(!Variables.getInstance().system.handle || !Variables.getInstance().system.baseClientAddr || !Variables.getInstance().system.baseServerAddr) return;

        const now = Date.now();  
        delta = now - time;       
        time = now;      

        Server.getInstance().update();

        if(Variables.getInstance().spinbot.enabled) {
            Variables.getInstance().spinbot.execute(delta);
        }

        if(Variables.getInstance().aimbot.enabled) {
            Variables.getInstance().aimbot.execute(delta);
        }

        if(Variables.getInstance().balancer.enabled) {
            Variables.getInstance().balancer.execute(delta);
        } else if (Variables.getInstance().balancer.needReset) {
            Variables.getInstance().balancer.resetWalk();
        }

    }, 1);
}

export function ipcListeners() {

    const cheats: { id: string, displayName: string, components?: { name: string, type: string, value: any }[] }[] = [
        {
            id: 'aimbot',
            displayName: 'Enable aimbot'
        },
        {
            id: 'balancer',
            displayName: 'Enable balancer'
        },
        {
            id: 'spinbot',
            displayName: 'Enable spinbot',
            components: [
                {
                    name: 'speed',
                    type: 'slider',
                    value: Variables.getInstance().spinbot.speed
                },
                {
                    name: 'distance',
                    type: 'slider',
                    value: Variables.getInstance().spinbot.distance
                }
            ]
        },
        {
            id: 'esp_box',
            displayName: 'Enable esp box'
        },
        {
            id: 'esp_snapline',
            displayName: 'Enable esp snapline'
        },
        {
            id: 'spoofer',
            displayName: 'Run spoofer'
        },
        {
            id: 'bot_attack',
            displayName: 'Run bot attack'
        },
        {
            id: 'join_bot',
            displayName: 'Make join  custom bot'
        }

    ];

    ipcMain.on('attach', (_) => {

        if(Variables.getInstance().system.gameAttached) {
            console.log("Game already attached");
            return;
        }

        const DDNetClient = "DDNet.exe"; // "DDPer.exe";

        try {
            const proc = openProcess(DDNetClient);
            Variables.getInstance().system.handle = proc.handle;
            const base = BigInt(proc.modBaseAddr);

            Variables.getInstance().system.baseServerAddr = readMemory(Variables.getInstance().system.handle, base + offsets.staticServerAddr, PTR);
            Variables.getInstance().system.baseClientAddr = readMemory(Variables.getInstance().system.handle, base + offsets.staticClientAddr, PTR);

            Variables.getInstance().system.gameAttached = true;
            console.log("Game attached");

            new Notification({ title: 'Game attached', body: 'Game attached successfully' }).show();

        } catch(e: any) {
            if(e.message == 'unable to find process') {
                Variables.getInstance().system.gameAttached = false;
                console.log("Game attaching failed");
            } else {
                throw e;
            }
        }

    });

    // ipcMain.on('getOnlinePlayers', (event) => {
    //     const onlinePlayers = Server.getInstance(Variables.getInstance().system).players;
    //     if(!onlinePlayers) {
    //         event.reply('onlinePlayersResponse', []);
    //     } else {
    //         event.reply('onlinePlayersResponse', onlinePlayers);
    //     }
    // });

    ipcMain.on('getCheats', (event) => {
        event.reply('getCheatsResponse', cheats);
    });

    ipcMain.on('updateValue', (_, data: {cheatId: string, componentName: string, newValue: any}) => {
        Variables.getInstance()[data.cheatId][data.componentName]  = data.newValue;
    });

    ipcMain.on('enableCheat', async (_, type) => {

        if(!Variables.getInstance().system.gameAttached) {
            console.log("No game attached");
            return;
        }

        console.debug("Toggling", type);

        try {
            switch (type) {
                case "spinbot":
                    Variables.getInstance().spinbot.enabled = !Variables.getInstance().spinbot.enabled;
                    break;

                case "aimbot":
                    Variables.getInstance().aimbot.enabled = !Variables.getInstance().aimbot.enabled;

                    break;

                case "balancer": 
                Variables.getInstance().balancer.enabled = !Variables.getInstance().balancer.enabled;

                    break;

                default:
                    console.log("Unknown type");
            }
        } catch (error) {
            console.error("Error enabling cheat:", error);
        }
    });
}

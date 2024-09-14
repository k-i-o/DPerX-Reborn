import { BrowserWindow, ipcMain } from 'electron';
import {  openProcess, PTR, readMemory } from '../../IOMemoryUtility/memoryjs';
import { Notification } from 'electron/main';
import { Offsets } from './models/singletons/Offsets';
import { Server } from './models/singletons/Server';
import { Variables } from './models/singletons/Variables';
import { IMenuCheatCategory } from '../interfaces/IMenuCheatCategory';

function keyPressed(keys): boolean {

}

function canBeExecuted(cheat: any): boolean {
    return (!cheat.hotkeys && cheat.enabled) || (cheat.hotkeys && cheat.enabled && keyPressed(cheat.hotkeys));
}

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

        if(canBeExecuted(Variables.getInstance().spinbot)) {
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

    });
}

export function ipcListeners(window: BrowserWindow | null) {
    const cheats: IMenuCheatCategory[] = [
        {
            icon: '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-currency"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M4 4l3 3" /><path d="M20 4l-3 3" /><path d="M4 20l3 -3" /><path d="M20 20l-3 -3" /></svg>',
            title: 'Aiming Assistance',
            description: 'Tools to enhance aiming precision and control during gameplay.',
            items: [
                {
                    id: 'aimbot',
                    title: 'Enable Aimbot',
                    needGame: true,
                    type: 'toggle',
                    enabled: Variables.getInstance().aimbot.enabled,
                    components: []
                }
            ]
        },
        {
            icon: '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-rotate-rectangle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.09 4.01l.496 -.495a2 2 0 0 1 2.828 0l7.071 7.07a2 2 0 0 1 0 2.83l-7.07 7.07a2 2 0 0 1 -2.83 0l-7.07 -7.07a2 2 0 0 1 0 -2.83l3.535 -3.535h-3.988" /><path d="M7.05 11.038v-3.988" /></svg>',
            title: 'Movement Enhancements',
            description: 'Boost your movement abilities with enhanced spinning and speed control.',
            items: [
                {
                    id: 'spinbot',
                    title: 'Enable Spinbot',
                    needGame: true,
                    type: 'toggle',
                    enabled: Variables.getInstance().spinbot.enabled,
                    components: [
                        {
                            id: 'hotkeys',
                            type: 'listener',
                            value: Variables.getInstance().spinbot.hotkeys
                        },
                        {
                            id: 'speed',
                            type: 'slider',
                            value: Variables.getInstance().spinbot.speed
                        },
                        {
                            id: 'distance',
                            type: 'slider',
                            value: Variables.getInstance().spinbot.distance
                        }
                    ]
                },
                {
                    id: 'balancer',
                    title: 'Enable Auto Balancer',
                    needGame: true,
                    type: 'toggle',
                    enabled: Variables.getInstance().balancer.enabled,
                    components: []
                }
            ]
        },
        {
            icon: '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye-bolt"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M13.1 17.936a9.28 9.28 0 0 1 -1.1 .064c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /><path d="M19 16l-2 3h4l-2 3" /></svg>',
            title: 'ESP & Vision Enhancements',
            description: 'Get a visual advantage with enhanced environmental awareness.',
            items: [
                // {
                //     id: 'esp_box',
                //     title: 'Enable ESP Box',
                //     enabled: Variables.getInstance().esp_box.enabled,
                //     components: []
                // },
                // {
                //     id: 'esp_snapline',
                //     title: 'Enable ESP Snapline',
                //     enabled: Variables.getInstance().esp_snapline.enabled,
                //     components: []
                // }
            ]
        },
        {
            icon: '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-shield"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.884 2.007l.114 -.007l.118 .007l.059 .008l.061 .013l.111 .034a.993 .993 0 0 1 .217 .112l.104 .082l.255 .218a11 11 0 0 0 7.189 2.537l.342 -.01a1 1 0 0 1 1.005 .717a13 13 0 0 1 -9.208 16.25a1 1 0 0 1 -.502 0a13 13 0 0 1 -9.209 -16.25a1 1 0 0 1 1.005 -.717a11 11 0 0 0 7.531 -2.527l.263 -.225l.096 -.075a.993 .993 0 0 1 .217 -.112l.112 -.034a.97 .97 0 0 1 .119 -.021z" /></svg>',
            title: 'Anti-Detection & Spoofing',
            description: 'Tools to protect your identity and avoid detection by anti-cheat systems.',
            items: [
                {
                    id: 'spoofer',
                    title: 'Run Spoofer',
                    needGame: false,
                    type: 'run',
                    components: [
                        {
                            id: 'backup',
                            type: 'toggle',
                            value: Variables.getInstance().spoofer.backup
                        },
                    ]
                }
            ]
        },
        {
            icon: '<svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-robot"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 4m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" /><path d="M12 2v2" /><path d="M9 12v9" /><path d="M15 12v9" /><path d="M5 16l4 -2" /><path d="M15 14l4 2" /><path d="M9 18h6" /><path d="M10 8v.01" /><path d="M14 8v.01" /></svg>',
            title: 'Bot Manipulation',
            description: 'Manipulate bots for attack strategies or custom gameplay experiences.',
            items: [
                // {
                //     id: 'bot_attack',
                //     title: 'Run Bot Attack',
                //     enabled: Variables.getInstance().bot_attack.enabled,
                //     components: []
                // },
                // {
                //     id: 'join_bot',
                //     title: 'Join Custom Bot',
                //     enabled: Variables.getInstance().join_bot.enabled,
                //     components: []
                // }
            ]
        }
    ];

    const proceed = (needGame: boolean): boolean => {
        if((needGame && Variables.getInstance().system.gameAttached) || Variables.getInstance().system.gameAttached) {
            return true;
        } 
        
        return false;
    }

    ipcMain.on('minimize', (_) => {
        window?.minimize();
    });

    ipcMain.on('close', (_) => {
        window?.close();
    });

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

            Variables.getInstance().system.baseServerAddr = readMemory(Variables.getInstance().system.handle, base + Offsets.getInstance().staticServerAddr, PTR);
            Variables.getInstance().system.baseClientAddr = readMemory(Variables.getInstance().system.handle, base + Offsets.getInstance().staticClientAddr, PTR);

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

    ipcMain.on('newHotkeys', (_, {cheatId, componentId, newValue}) => {
        Variables.getInstance()[cheatId][componentId].hotkeys = JSON.parse(newValue);
    });

    ipcMain.on('getCheats', (event) => {
        event.reply('getCheatsResponse', cheats);
    });

    ipcMain.on('updateValue', (_, {cheatId, componentId, newValue}) => {
        Variables.getInstance()[cheatId][componentId] = newValue;
    });

    ipcMain.on('runCheat', async (_, { type, needGame }) => {

        proceed(needGame);

        try {
            switch (type) {
                case "spoofer":
                    Variables.getInstance().spoofer.execute();
                    break;

                default:
                    console.log("Unknown type");
            }
        } catch (error) {
            console.error("Error enabling cheat:", error);
        }
    });

    ipcMain.on('enableCheat', async (_, { type, status, needGame }) => {

        proceed(needGame);

        try {
            switch (type) {
                case "spinbot":
                    Variables.getInstance().spinbot.enabled = status;
                    break;

                case "aimbot":
                    Variables.getInstance().aimbot.enabled = status;
                    break;

                case "balancer": 
                    Variables.getInstance().balancer.enabled = status;
                    break;

                default:
                    console.log("Unknown type");
            }
        } catch (error) {
            console.error("Error enabling cheat:", error);
        }
    });
}

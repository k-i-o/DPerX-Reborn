import { ipcMain } from 'electron';
import { Variables } from './variables';
const memoryjs = require('../../IOMemoryUtility/memoryjs/index');

export function ipcListeners(variables: Variables) {

    const DDNetClient = 'DDNet.exe'; // 'DDPer.exe';

    const ac_client = memoryjs.openProcess(DDNetClient);
    const handle = ac_client.handle;
    const base = BigInt(ac_client.modBaseAddr);

    const staticServerAddr = BigInt(0x5AC880);
    const staticClientAddr = BigInt(0x57F9D0);

    const baseServerAddr = BigInt(memoryjs.readMemory(handle, base + staticServerAddr, memoryjs.PTR));
    const baseClientAddr = BigInt(memoryjs.readMemory(handle, base + staticClientAddr, memoryjs.PTR));

    const offsets = {
        aimX: BigInt(0x10),
        aimY: BigInt(0x14)
    }

    // console.log(memoryjs.readMemory(handle, BigInt(baseServer) + BigInt(0x1450), memoryjs.INT));

    ipcMain.on('enableCheat', async (_, type) => {
        console.debug("Enabling", type);

        try {
            switch (type) {
                case "spinbot":
                    variables.spinbot.enabled = !variables.spinbot.enabled;
                    // let angle = 0; 

                    // setInterval(() => {
                    //     angle = (angle + 10) % 360;
                        
                    //     const radians = angle * (Math.PI / 180);
                    //     const x = Math.sin(radians) * 100; 
                    //     const y = Math.cos(radians) * 100; 
                        
                    //     memoryjs.writeMemory(handle, baseClientAddr + offsets.aimX, x, memoryjs.FLOAT);
                    //     memoryjs.writeMemory(handle, baseClientAddr + offsets.aimY, y, memoryjs.FLOAT);
                    // }, 0); 
                    break;

                case "read_memory":

                    break;

                default:
                    console.log("Unknown type");
            }
        } catch (error) {
            console.error("Error enabling cheat:", error);
        }
    });
}

import { Aimbot } from "../cheats/Aimbot";
import { Balancer } from "../cheats/Balancer";
import { ISystemVariables } from "../../../interfaces/ISystemVariables";
import { Spinbot } from "../cheats/Spinbot";
import { Spoofer } from "../cheats/Spoofer";
import { GlobalKeyboardListener } from "node-global-key-listener";
import { BotManager } from "../cheats/BotManager";

export class Variables {

    system: ISystemVariables = { gameAttached: false, handle: undefined, baseClientAddr: undefined, baseServerAddr: undefined };
    globalListener = new GlobalKeyboardListener();

    spinbot: Spinbot = new Spinbot();
    aimbot: Aimbot = new Aimbot();
    balancer: Balancer = new Balancer();
    spoofer: Spoofer = new Spoofer();
    botManager: BotManager = new BotManager();

    private static instance: Variables;
    private constructor() {}
    static getInstance(): Variables {
        if (!Variables.instance) {
            Variables.instance = new Variables();
        }
        return Variables.instance;
    }

}
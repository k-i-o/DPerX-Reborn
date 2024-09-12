import { Aimbot } from "../cheats/Aimbot";
import { Balancer } from "../cheats/Balancer";
import { ISystemVariables } from "../../../interfaces/ISystemVariables";
import { Spinbot } from "../cheats/Spinbot";

export class Variables {

    system: ISystemVariables = { gameAttached: false, handle: undefined, baseClientAddr: undefined, baseServerAddr: undefined };
    spinbot: Spinbot = new Spinbot();
    aimbot: Aimbot = new Aimbot();
    balancer: Balancer = new Balancer();

    private static instance: Variables;
    private constructor() {}
    static getInstance(): Variables {
        if (!Variables.instance) {
            Variables.instance = new Variables();
        }
        return Variables.instance;
    }

}
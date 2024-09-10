import { Aimbot } from "../cheats/Aimbot";
import { Balancer } from "../cheats/Balancer";
import { ISystemVariables } from "../../interfaces/ISystemVariables";
import { Spinbot } from "../cheats/Spinbot";

export class Variables {

    system: ISystemVariables;
    spinbot: Spinbot;
    aimbot: Aimbot;
    balancer: Balancer;

    private static instance: Variables;

    private constructor() {
        this.system = { gameAttached: false, handle: undefined, baseClientAddr: undefined, baseServerAddr: undefined };

        this.spinbot = new Spinbot();
        this.aimbot = new Aimbot();
        this.balancer = new Balancer();
    }

    static getInstance(): Variables {
        if (!Variables.instance) {
            Variables.instance = new Variables();
        }
        return Variables.instance;
    }

}
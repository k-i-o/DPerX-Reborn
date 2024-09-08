import { Aimbot } from "./models/Aimbot";
import { Balancer } from "./models/Balancer";
import { Spinbot } from "./models/Spinbot";
import { ISystemVariables } from "./models/ISystemVariables";

export class Variables {

    system: ISystemVariables;
    spinbot: Spinbot;
    aimbot: Aimbot;
    balancer: Balancer;

    constructor() {
        this.system = { gameAttached: false, handle: undefined, baseClientAddr: undefined, baseServerAddr: undefined };

        this.spinbot = new Spinbot(this.system);
        this.aimbot = new Aimbot(this.system);
        this.balancer = new Balancer(this.system);
    }

}
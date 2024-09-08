import { Aimbot } from "./models/aimbot";
import { Balancer } from "./models/balancer";
import { Spinbot } from "./models/spinbot";

export class Variables {

    spinbot: Spinbot = new Spinbot();
    aimbot: Aimbot = new Aimbot();
    balancer: Balancer = new Balancer();

}
import { IBase } from "../../interfaces/IBase";
import { Variables } from "../singletons/Variables";

export class Aimbot implements IBase {
        
    enabled: boolean = false;
    maxDistance: number = 999;
    autoFire: boolean = false;

    execute(delta: number): void {
        const systemVar = Variables.getInstance().system;
        if (!systemVar.baseClientAddr) return;

    }

}
import { FLOAT, writeMemory } from "../../../../IOMemoryUtility/memoryjs";
import { Offsets } from "../singletons/Offsets";
import { IBase } from "../../../interfaces/IBase";
import { Variables } from "../singletons/Variables";

export class Spinbot implements IBase {

    private angle: number = 0;

    enabled: boolean = false;
    distance: number = 100;
    speed: number = 50;
    autofire: boolean = false;

    execute(delta: number) {
        const systemVar = Variables.getInstance().system;
        if (!systemVar.baseClientAddr) return;

        this.angle = (this.angle + (this.speed * delta / 1000)) % 360;

        const radians = this.angle * (Math.PI / 180);

        const x = Math.sin(radians) * this.distance; 
        const y = Math.cos(radians) * this.distance; 

        writeMemory(systemVar.handle, systemVar.baseClientAddr + Offsets.getInstance().client.aimX, x, FLOAT);
        writeMemory(systemVar.handle, systemVar.baseClientAddr + Offsets.getInstance().client.aimY, y, FLOAT);
    }
}
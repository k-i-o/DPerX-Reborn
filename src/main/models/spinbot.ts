import { FLOAT, writeMemory } from "../../../IOMemoryUtility/memoryjs";
import { offsets } from "../offsets";
import { Base } from "./Base";
import { BaseCheat } from "./BaseCheat";
import { ISystemVariables } from "./ISystemVariables";

export class Spinbot extends BaseCheat implements Base {

    private angle: number = 0;

    enabled: boolean = false;
    distance: number = 100;
    speed: number = 50;
    autofire: boolean = false;

    constructor(systemVariables: ISystemVariables) {
        super(systemVariables);
    }

    execute() {
        if(!this.systemVariables.baseClientAddr) return;

        this.angle = (this.angle + 10) % 360;
            
        const radians = this.angle * (Math.PI / 180);
        const x = Math.sin(radians) * 100; 
        const y = Math.cos(radians) * 100; 
        
        writeMemory(this.systemVariables.handle, this.systemVariables.baseClientAddr + offsets.aimX, x, FLOAT);
        writeMemory(this.systemVariables.handle, this.systemVariables.baseClientAddr + offsets.aimY, y, FLOAT);
    }
}
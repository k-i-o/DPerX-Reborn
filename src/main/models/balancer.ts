import { INT, writeMemory } from "../../../IOMemoryUtility/memoryjs";
import { offsets } from "../offsets";
import { getNearestToPlayer } from "../utils";
import { Base } from "./Base";
import { BaseCheat } from "./BaseCheat";
import { ISystemVariables } from "./ISystemVariables";

export class Balancer extends BaseCheat implements Base {
    
    enabled: boolean = false;
    needReset: boolean = false;
    
    constructor(systemVariables: ISystemVariables) {
        super(systemVariables);
    }

    execute(): void {

        // const nearest = getNearestToPlayer(1000);
      
        // if(localPlayer.position.x > nearest.position.x){
        //     writeMemory(this.systemVariables.handle, this.systemVariables.baseClientAddr! + offsets.rWalk, 0, INT);
        //     writeMemory(this.systemVariables.handle, this.systemVariables.baseClientAddr! + offsets.lWalk, 1, INT);
        // }

        // if(localPlayer.position.x < nearest.position.x){
        //     writeMemory(this.systemVariables.handle, this.systemVariables.baseClientAddr! + offsets.lWalk, 0, INT);
        //     writeMemory(this.systemVariables.handle, this.systemVariables.baseClientAddr! + offsets.rWalk, 1, INT);
        // }

        this.needReset = true;  
    }

    resetWalk(): void {
        writeMemory(this.systemVariables.handle, this.systemVariables.baseClientAddr! + offsets.lWalk, 0, INT);
        writeMemory(this.systemVariables.handle, this.systemVariables.baseClientAddr! + offsets.rWalk, 0, INT);
        this.needReset = false;
    }
    
}
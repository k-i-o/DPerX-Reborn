import { INT, writeMemory } from "../../../../IOMemoryUtility/memoryjs";
import { Offsets } from "../singletons/Offsets";
import { IBase } from "../../../interfaces/IBase";
import { Variables } from "../singletons/Variables";
import { getNearestToPlayer } from "../../utils";
import { Server } from "../singletons/Server";

export class Balancer implements IBase {
    
    enabled: boolean = false;
    needReset: boolean = false;
    distance: number = 999;
    
    execute(delta: number): void {
        const systemVar = Variables.getInstance().system;
        const localPlayer = Server.getInstance().localPlayer;
        if (!systemVar.baseClientAddr || !localPlayer) return;

        const nearest = getNearestToPlayer(this.distance);
        if(!nearest) return;
      
        if(localPlayer.position.x > nearest.position.x){
            writeMemory(Variables.getInstance().system.handle, Variables.getInstance().system.baseClientAddr! + Offsets.getInstance().client.rWalk, 0, INT);
            writeMemory(Variables.getInstance().system.handle, Variables.getInstance().system.baseClientAddr! + Offsets.getInstance().client.lWalk, 1, INT);
        }

        if(localPlayer.position.x < nearest.position.x){
            writeMemory(Variables.getInstance().system.handle, Variables.getInstance().system.baseClientAddr! + Offsets.getInstance().client.lWalk, 0, INT);
            writeMemory(Variables.getInstance().system.handle, Variables.getInstance().system.baseClientAddr! + Offsets.getInstance().client.rWalk, 1, INT);
        }

        this.needReset = true;  
    }

    resetWalk(): void {
        const systemVar = Variables.getInstance().system;
        if (!systemVar.baseClientAddr) return;

        writeMemory(systemVar.handle, systemVar.baseClientAddr! + Offsets.getInstance().client.lWalk, 0, INT);
        writeMemory(systemVar.handle, systemVar.baseClientAddr! + Offsets.getInstance().client.rWalk, 0, INT);
        this.needReset = false;
    }
    
}
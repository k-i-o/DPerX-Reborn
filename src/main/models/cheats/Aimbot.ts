import { FLOAT, writeMemory } from "../../../../IOMemoryUtility/memoryjs";
import { IBase } from "../../../interfaces/IBase";
import { getNearestToPlayer } from "../../utils";
import { Offsets } from "../singletons/Offsets";
import { Server } from "../singletons/Server";
import { Variables } from "../singletons/Variables";

export class Aimbot implements IBase {
        
    enabled: boolean = false;
    maxDistance: number = 999;
    autoFire: boolean = false;

    hotkeys: number[] = [];
    holdHotkeys: boolean = false;

    execute(profile: string, delta: number): void {
        const systemVar = Variables.getInstance().system;
        const localplayer = Server.getInstance().localPlayer;
        if (!systemVar.baseClientAddr || !localplayer) return;

        const nearest = getNearestToPlayer(this.maxDistance);
        if(!nearest) return;

        const target = { x: nearest.position.x - localplayer.position.x, y: nearest.position.y - localplayer.position.y };
    
        writeMemory(Variables.getInstance().system.handle, Variables.getInstance().system.baseClientAddr! + Offsets.getInstance().profiles[profile].client.aimX, target.x, FLOAT);
        writeMemory(Variables.getInstance().system.handle, Variables.getInstance().system.baseClientAddr! + Offsets.getInstance().profiles[profile].client.aimY, target.y, FLOAT);
    
    }

}
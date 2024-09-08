import { Base } from "./Base";
import { BaseCheat } from "./BaseCheat";
import { ISystemVariables } from "./ISystemVariables";

export class Aimbot extends BaseCheat implements Base {
        
    enabled: boolean = false;
    maxDistance: number = 999;
    autoFire: boolean = false;

    constructor(systemVariables: ISystemVariables) {
        super(systemVariables);
    }

    execute(): void {
        
    }

}
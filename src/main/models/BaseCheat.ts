import { ISystemVariables } from "./ISystemVariables";

export class BaseCheat {

    protected systemVariables: ISystemVariables;

    constructor(systemVariables: ISystemVariables) {
        this.systemVariables = systemVariables;
    }
}
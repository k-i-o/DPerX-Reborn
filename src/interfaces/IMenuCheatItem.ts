import { IMenuCheatItemComponent } from "./IMenuCheatItemComponent";

export interface IMenuCheatItem {
    id: string;
    title: string;
    enabled: boolean;
    components: IMenuCheatItemComponent[]
}
import { IMenuCheatItemComponent } from "./IMenuCheatItemComponent";

export interface IMenuCheatItem {
    id: string;
    title: string;
    needGame: boolean;
    type: "run" | "toggle";
    enabled?: boolean;
    components: IMenuCheatItemComponent[]
}
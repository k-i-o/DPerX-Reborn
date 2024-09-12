import { IMenuCheatItem } from "./IMenuCheatItem";

export interface IMenuCheatCategory {
    icon?: string;
    title: string;
    description?: string;
    items: IMenuCheatItem[];
}
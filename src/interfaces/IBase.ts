export interface IBase {
    enabled?: boolean;
    hotkeys: any[];
    execute(delta: number): void;
}
export interface IBase {
    enabled?: boolean;
    hotkeys: number[];
    execute(delta: number): void;
}
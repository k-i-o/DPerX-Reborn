export interface IBase {
    enabled?: boolean;
    hotkeys: number[];
    execute(profile: string, delta: number): void;
}
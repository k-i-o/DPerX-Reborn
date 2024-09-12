export interface IBase {
    enabled: boolean;
    execute(delta: number): void;
}
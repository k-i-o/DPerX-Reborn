import { IVector2 } from "./IVector2";

export interface IPlayer {
    id: number;
    gametick: number;
    position: IVector2;
    velocity: IVector2;
    hookTime: number;
    freezed: boolean;
    playerSize: number;
}
import { IPlayer } from "./IPlayer";

export class Server {
    static maxPlayers: number = 64;
    players: IPlayer[] = [];
}
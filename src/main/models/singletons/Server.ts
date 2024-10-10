import { BOOL, INT, readMemory } from "../../../../IOMemoryUtility/memoryjs";
import { IPlayer } from "../../../interfaces/IPlayer";
import { Offsets } from "./Offsets";
import { Variables } from "./Variables";

export class Server {

    maxPlayers: number = 64;
    onlinePlayers: number = 0;
    players: IPlayer[] = [];
    localPlayer?: IPlayer;

    private static instance: Server;
    private constructor() {}
    static getInstance(): Server {
        if (!Server.instance) {
            Server.instance = new Server();
        }
        return Server.instance;
    }

    update(profile) {
        const systemVar = Variables.getInstance().system;
        if (!systemVar.baseServerAddr) return;

        const baseAddr = systemVar.baseServerAddr;

        const read = (offset: bigint, type: string) => {
            return readMemory(systemVar.handle, baseAddr + offset, type);
        }

        this.onlinePlayers = read(Offsets.getInstance().profiles[profile].server.onlinePlayers, INT);
        const localPlayerId = read(Offsets.getInstance().profiles[profile].server.localPlayerId, INT);

        this.players = [];
        for(let i = 0; i < this.maxPlayers; i++) {
            let offsetPlayers = BigInt(i * 0xF8);
            const player: IPlayer = {
                id: i,
                gametick: read(Offsets.getInstance().profiles[profile].server.gametick + offsetPlayers, INT),
                position: { x: read(Offsets.getInstance().profiles[profile].server.playerX + offsetPlayers, INT), y: read(Offsets.getInstance().profiles[profile].server.playerY + offsetPlayers, INT) },
                velocity: { x: read(Offsets.getInstance().profiles[profile].server.velX + offsetPlayers, INT), y: read(Offsets.getInstance().profiles[profile].server.velY + offsetPlayers, INT) },
                // hookingTime: read(Offsets.getInstance().server.hookingTime + offsetPlayers, FLOAT),
                frozen: read(Offsets.getInstance().profiles[profile].server.frozen + offsetPlayers, BOOL),
                playerSize: 64
            }

            if(player.id == localPlayerId) {
                this.localPlayer = player;
            }

            this.players.push(player);
        }
        
    }
}
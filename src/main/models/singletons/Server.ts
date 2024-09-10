import { BOOL, INT, readMemory } from "../../../../IOMemoryUtility/memoryjs";
import { offsets } from "../../offsets";
import { IPlayer } from "../../interfaces/IPlayer";
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

    update() {
        const systemVar = Variables.getInstance().system;
        if (!systemVar.baseServerAddr) return;

        const baseAddr = systemVar.baseServerAddr;

        const read = (offset: bigint, type: string) => {
            return readMemory(systemVar.handle, baseAddr + offset, type);
        }

        this.onlinePlayers = read(offsets.server.onlinePlayers, INT);
        const localPlayerId = read(offsets.server.localPlayerId, INT);

        this.players = [];
        for(let i = 0; i < this.maxPlayers; i++) {
            let offsetPlayers = BigInt(i * 0xF8);
            const player: IPlayer = {
                id: i,
                gametick: read(offsets.server.gametick + offsetPlayers, INT),
                position: { x: read(offsets.server.playerX + offsetPlayers, INT), y: read(offsets.server.playerY + offsetPlayers, INT) },
                velocity: { x: read(offsets.server.velX + offsetPlayers, INT), y: read(offsets.server.velY + offsetPlayers, INT) },
                // hookingTime: read(offsets.server.hookingTime + offsetPlayers, FLOAT),
                frozen: read(offsets.server.frozen + offsetPlayers, BOOL),
                playerSize: 64
            }

            if(player.id == localPlayerId) {
                this.localPlayer = player;
            }

            this.players.push(player);
        }
        
    }
}
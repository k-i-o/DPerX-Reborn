import { BOOL, FLOAT, INT, readMemory } from "../../../IOMemoryUtility/memoryjs";
import { offsets } from "../offsets";
import { BaseCheat } from "./BaseCheat";
import { IPlayer } from "./IPlayer";
import { ISystemVariables } from "./ISystemVariables";

export class Server extends BaseCheat {

    maxPlayers: number = 64;
    onlinePlayers: number = 0;
    players: IPlayer[] = [];

    private static instance: Server;

    private constructor(systemVariables: ISystemVariables) {
        super(systemVariables);
    }

    static getInstance(systemVariables: ISystemVariables): Server {
        if (!Server.instance) {
            Server.instance = new Server(systemVariables);
        }
        return Server.instance;
    }

    update() {
        if(!this.systemVariables.baseServerAddr) return;

        const baseAddr = this.systemVariables.baseServerAddr;

        const read = (offset: bigint, type: string) => {
            return readMemory(this.systemVariables.handle, baseAddr + offset, type);
        }

        this.onlinePlayers = read(offsets.server.onlinePlayers, INT);

        this.players = [];
        for(let i = 0; i < this.maxPlayers; i++) {
            let offsetPlayers = BigInt(i * 0xF8);
            const player: IPlayer = {
                id: i,
                gametick: read(offsets.server.gametick + offsetPlayers, INT),
                position: { x: read(offsets.server.playerX + offsetPlayers, INT), y: read(offsets.server.playerY + offsetPlayers, INT) },
                velocity: { x: read(offsets.server.velX + offsetPlayers, INT), y: read(offsets.server.velY + offsetPlayers, INT) },
                hookingTime: read(offsets.server.hookingTime + offsetPlayers, FLOAT),
                frozen: read(offsets.server.frozen + offsetPlayers, BOOL),
                playerSize: 64
            }

            // console.log(player)

            this.players.push(player);
        }
        
    }
}
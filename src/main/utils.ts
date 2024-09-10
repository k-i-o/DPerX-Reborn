import { IPlayer } from "./interfaces/IPlayer";
import { IVector2 } from "./interfaces/IVector2";
import { Server } from "./models/singletons/Server";

export function distance(a: IVector2, b: IVector2) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function getNearestToPlayer(maxDistance: number): IPlayer | undefined {
    const server = Server.getInstance();
    const localPlayer = server.localPlayer;
    
    if (!localPlayer) return undefined;

    let closestPlayer: IPlayer | undefined;
    let closestDist = maxDistance;

    for (const player of server.players) {
        if (player.id != localPlayer.id && !player.frozen && player.gametick != 0) {
            const dist = distance(player.position, localPlayer.position);

            if (dist > 0 && dist < closestDist) {
                closestDist = dist;
                closestPlayer = player;
            }
        }
    }

    return closestPlayer;
}

import { IPlayer } from "./models/IPlayer";
import { IVector2 } from "./models/IVector2";
import { Server } from "./models/Server";

export function distance(a: IVector2, b: IVector2) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function getNearestToPlayer(maxDistance: number) {//: IPlayer {

    // let closestDist: number = maxDistance;
    // let closestPlayer: IPlayer;

    // for (let i = 0; i < Server.maxPlayers; i++)
    // {
        // const player = server->players[i];

        // if (player.id != Server::localPlayer.id && server->GetValidPlayer(player) && ((avoid_freezed_tee && !player.freezed) || !avoid_freezed_tee))
        // {
        //     float dist = Aimbot::distance(player.position, Server::localPlayer.position);

        //     if (dist > 0 && dist < closestDist)
        //     {
        //         closestDist = dist;
        //         closestPlayer = player;
        //     }
            
        // }
    // }

    // return closestPlayer;
}
import { Client } from "teeworlds";

export class Bot {

    name: string;
    clan: string;
    private client;

    constructor(name, clan) {
        this.name = name;
        this.clan = clan;
    }

    join(ip: string, port: number) {
        if(!this.name || !this.clan) return;


    }
}
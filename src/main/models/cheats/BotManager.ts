import { Client } from "teeworlds";
import { IBase } from "../../../interfaces/IBase";
import { Bot } from "./Bot";

export class BotManager implements IBase {

    // bots: Bot[] = [];
    hotkeys: number[] = [];

    ip: string;
    port: number;
    name: string;
    clan: string;
    country: number;
    skin: string;
    bodyColor: number;
    feetColor: number;
    useCustomColors: boolean;
    private client;

    constructor() {
        this.ip = "127.0.0.1";
        this.port = 8303;
        this.name = "Bot";
        this.clan = "Clan"; 
        this.country = 0; 
        this.skin = "grey_fox"; 
        this.bodyColor = 133532; 
        this.feetColor = 133532; 
        this.useCustomColors = false; 
    }

    execute(): void {
        // this.bots.push(new Bot("Ses", "clan"));
        // this.bots.forEach(b=>{
        //     b.join(this.ip, this.port);
        // })
           
        this.client = new Client(this.ip, this.port, this.name, {
            identity: {
                id: 0,
                name: this.name,
                clan: this.clan,
                country: this.country,
                skin: this.skin,
                use_custom_color: this.useCustomColors ? 1 : 0,
                color_body: this.bodyColor,
                color_feet: this.feetColor
            }
        });

        this.client.connect();

        this.client.on("connected", () => {
            console.log("Connected!");
        });

        this.client.on("disconnect", reason => {
            console.log("Disconnected: " + reason);
        });

        this.client.on("message", message => {
            console.log(message);
        });
    }
}
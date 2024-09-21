import { Client } from "teeworlds";
import { IBase } from "../../../interfaces/IBase";
import { hexToTwColor } from "../../utils";

export class BotManager implements IBase {

    // bots: Bot[] = [];
    hotkeys: number[] = [];

    ip: string;
    port: number;
    name: string;
    clan: string;
    country: number;
    skin: string;
    bodyColor: string;
    feetColor: string;
    useCustomColors: boolean;
    private client;

    constructor() {
        this.ip = "127.0.0.1";
        this.port = 8303;
        this.name = "Bot";
        this.clan = "Clan"; 
        this.country = 0; 
        this.skin = "greyfox"; 
        this.bodyColor = "#ffffff"; 
        this.feetColor = "#ffffff"; 
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
                color_body: hexToTwColor(this.bodyColor),
                color_feet: hexToTwColor(this.feetColor)
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
            // console.log(message);
        });
    }
}
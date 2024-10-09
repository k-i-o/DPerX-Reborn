export class Offsets {

    profiles: {
        [key: string]: {
            exeName: string,

            staticServerAddr: bigint,
            staticClientAddr: bigint,
        
            client: {
                aimX: bigint,
                aimY: bigint,
                lWalk: bigint,
                rWalk: bigint,
            };
        
            server: {
                localPlayerId: bigint,
                onlinePlayers: bigint,
                gametick: bigint,
                playerX: bigint,
                playerY: bigint,
                velX: bigint,
                velY: bigint,
                aimAngle: bigint,
                frozenTime: bigint,
                frozen: bigint,
                hookingTime: bigint
            }        
        };  
    } = {};

    private static instance: Offsets;
    private constructor() {}
    static getInstance(): Offsets {
        if (!Offsets.instance) {
            Offsets.instance = new Offsets();
        }
        return Offsets.instance;
    }

    loadDefaultOffsets() {
        this.profiles["DDNet"] = {
            exeName: "DDNet.exe",
            staticServerAddr: BigInt(0x5C1900),
            staticClientAddr: BigInt(0x463C20),
            client: {
                aimX: BigInt(0x10),
                aimY: BigInt(0x14),
                lWalk: BigInt(0x100),
                rWalk: BigInt(0x108),
            },
            server: {
                localPlayerId: BigInt(0x1450),
                onlinePlayers: BigInt(0x1454),
                gametick: BigInt(0x147C),
                playerX: BigInt(0x1480),
                playerY: BigInt(0x1484),
                velX: BigInt(0x1488),
                velY: BigInt(0x148C),
                aimAngle: BigInt(0x1490),
                frozenTime: BigInt(0x14C0),
                frozen: BigInt(0x14CC),
                hookingTime: BigInt(0x14A4)
            }
        }

        this.profiles["DDPer"] = {
            exeName: "DDPer.exe", 
            staticServerAddr: BigInt(0x33DD18),
            staticClientAddr: BigInt(0x2F2CB8),
            client: {
                aimX: BigInt(0x10),
                aimY: BigInt(0x14),
                lWalk: BigInt(0xF0),
                rWalk: BigInt(0xF8),
            },
            server: {
                localPlayerId: BigInt(0x1450),
                onlinePlayers: BigInt(0x1454),
                gametick: BigInt(0x147C),
                playerX: BigInt(0x1480),
                playerY: BigInt(0x1484),
                velX: BigInt(0x1488),
                velY: BigInt(0x148C),
                aimAngle: BigInt(0x1490),
                frozenTime: BigInt(0x14C0),
                frozen: BigInt(0x14CC),
                hookingTime: BigInt(0x14A4)
            }
        }
    }
}
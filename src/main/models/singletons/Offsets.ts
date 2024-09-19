export class Offsets {

    exeName: string = "";

    staticServerAddr = BigInt(0);
    staticClientAddr = BigInt(0);

    client = {
        aimX: BigInt(0),
        aimY: BigInt(0),
        lWalk: BigInt(0),
        rWalk: BigInt(0),
    };

    server = {
        localPlayerId: BigInt(0),
        onlinePlayers: BigInt(0),
        gametick: BigInt(0),
        playerX: BigInt(0),
        playerY: BigInt(0),
        velX: BigInt(0),
        velY: BigInt(0),
        aimAngle: BigInt(0),
        frozenTime: BigInt(0),
        frozen: BigInt(0),
        hookingTime: BigInt(0)
    }

    private static instance: Offsets;
    private constructor() {}
    static getInstance(): Offsets {
        if (!Offsets.instance) {
            Offsets.instance = new Offsets();
        }
        return Offsets.instance;
    }

    loadDefaultOffsets() {
        this.exeName = "DDNet.exe"; // "DDPer.exe";
        this.staticServerAddr = BigInt(0x5AC880);
        this.staticClientAddr = BigInt(0x57F9D0);
        this.client = {
            aimX: BigInt(0x10),
            aimY: BigInt(0x14),
            lWalk: BigInt(0x100),
            rWalk: BigInt(0x108),
        };
        this.server = {
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
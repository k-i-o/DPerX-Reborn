export const offsets = {
    staticServerAddr: BigInt(0x5AC880),
    staticClientAddr: BigInt(0x57F9D0),
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
};
const memoryjs = require('../../IOMemoryUtility/memoryjs/index');

export const INT = memoryjs.INT;
export const FLOAT = memoryjs.FLOAT;
export const PTR = memoryjs.PTR;

export function openProcess(pName: string) {
    return memoryjs.openProcess(pName);
}

export function readMemory(handle: any, address: bigint, type: string) {
    if(type == PTR) {
        return BigInt(memoryjs.readMemory(handle, address, type));
    } 

    return memoryjs.readMemory(handle, address, type);
}

export function writeMemory(handle: any, address: bigint, value: any, type: string) {
    return memoryjs.writeMemory(handle, address, value, type);
}
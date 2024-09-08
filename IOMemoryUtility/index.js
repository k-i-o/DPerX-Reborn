// TEST FILE

const memoryjs = require('./memoryjs/index');

const ac_client = memoryjs.openProcess("DDNet.exe");

let handle = ac_client.handle;
let base = ac_client.modBaseAddr;

const baseServer = memoryjs.readMemory(handle, BigInt(base) + BigInt(0x5AC880), memoryjs.PTR);

console.log(memoryjs.readMemory(handle, BigInt(baseServer) + BigInt(0x1450), memoryjs.INT));
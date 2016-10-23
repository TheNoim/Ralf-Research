const net = require('net');
const whex = Buffer.from("fffb01", 'hex');
const whex2 = Buffer.from("fffb03", 'hex');
const whex3 = Buffer.from("fffb01fffb03", 'hex');
const whex4 = Buffer.from("fffb01fffb034f4b", 'hex');
const fa = Buffer.from("0d000a413f",'hex');
const fd = Buffer.from("0d000a443f", 'hex');
const o = Buffer.from("4f", 'hex');
const k = Buffer.from("4b", 'hex');
const opts = require("nomnom")
    .option('address', {
        abbr: 'a',
        full: 'address',
        help: 'Address of target device',
        required: true,
        type: 'string'
    })
    .option('data', {
        abbr: 'd',
        full: 'data',
        help: 'Data to set for target device',
        required: true,
        type: 'string'
    })
    .parse();
const address = Number(opts.address);
const datax = Number(opts.data);
console.log(opts.data);

if (typeof address != "number"){
    console.log("The address needs to be a number.");
    process.exit(1);
}
if (typeof datax != "number"){
    console.log("The data needs to be a number.");
    process.exit(1);
}

const client = net.connect({port: 10001, host: "192.168.0.210"}, () => {
    console.log('Connected');
});
client.on('data', (data) => {
    console.log(data);
    if (data.equals(whex) || data.equals(whex2) || data.equals(whex3) || data.equals(whex4)){
        console.log("Received welcome message.");
        client.write(">>o");
    } else if (data.equals(fa)){
        console.log("Received \"A?\"");
        const sendBuffer = Buffer.from([address]);
        client.write(sendBuffer);
    } else if (data.equals(fd)){
        console.log("Received \"D?\"");
        const sendBuffer = Buffer.from([datax]);
        client.write(sendBuffer);
    } else if (data.equals(o) || data.equals(k)){
        client.end();
        process.exit();
    } else {
        client.end();
        process.exit();
    }
});
client.on('end', () => {
    console.log('disconnected from server');
});

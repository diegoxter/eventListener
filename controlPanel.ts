const { artifacts, contract, network, ethers } = require('hardhat')
var readline = require('readline');
// const eventTesterABI = require("./abis/EventTester.json");
require('dotenv').config();

async function emitEvent() {
    const eventTesterAddress = "0x6D3931ECd8f4E74FD4Be0790842DdD855a648109";
    /* LEGACY/ LEARNING PURPOSES
    const provider = new ethers.providers.JsonRpcProvider(
       `https://${process.env.RIVET_KEY}.sepolia.rpc.rivet.cloud/`
    );
    const alice = await ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
    const contract = new ethers.Contract(eventTesterAddress, eventTesterABI, provider);
    */

    const [ alice ] = await ethers.getSigners()

    const contractFactory = await ethers.getContractFactory('EventTester')
    const contract = await contractFactory.attach(eventTesterAddress)
    console.log('Connected to: ' + (await ethers.provider.getNetwork()).name);

    const redeploy = async function () {
        const contractFactory = await ethers.getContractFactory('EventTester')
        const contract = await contractFactory.deploy()
        await contract.deployed()

        let contractAddress = contract.address

        console.log("These are the new contracts: " + contractAddress)
    }

    let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
    });

    rl.setPrompt('Input a command> ')
    rl.prompt()

    rl.on('line', async function(line) {
        switch(line.trim()) {
            case 'emit':
                console.log("Lanzando evento");

                await contract.connect(alice).emitTestEvent();
            
                console.log("Evento lanzado");
                break;
            case 'redeploy':
                console.log('Nuevo deploy...');
                await redeploy()
                break;
            case 'close':
                console.log('Closing');
                process.exit();
            default:
                console.log('Available commands are: emit, redeploy and close');
            break;
        }
        rl.prompt();
    })

    /*console.log(await ethers.provider.getBalance(
        alice.address
    ))*/

}

emitEvent();
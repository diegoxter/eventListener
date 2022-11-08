const { artifacts, contract, ethers, network } = require('hardhat')
var readline = require('readline');
const eventTesterABI = require("./abis/EventTester.json")
require('dotenv').config()

async function emitEvent() {
    const eventTesterAddress = "0x6D3931ECd8f4E74FD4Be0790842DdD855a648109"
    const provider = new ethers.providers.JsonRpcProvider(
       `https://${process.env.RIVET_KEY}.sepolia.rpc.rivet.cloud/`
    )
    const alice = await ethers.Wallet.fromMnemonic(process.env.MNEMONIC)

    const contract = new ethers.Contract(eventTesterAddress, eventTesterABI, provider)
    console.log('Connected to: ' + (await provider.getNetwork()).name)

    let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
    });

    rl.setPrompt('Lanzar evento? [y/n] ')
    rl.prompt()

    rl.on('line', async function(line) {
        switch(line.trim()) {
            case 'y':
                console.log("Lanzando evento")

                await contract.connect(alice.connect(provider)).emitTestEvent()
            
                console.log("Evento lanzado")
                break;
            case 'n':
                console.log('Closing');
                process.exit()
            default:
                console.log('Say what? I might have heard `' + line.trim() + '`');
            break;
        }
        rl.prompt();
    })

    /*console.log(await ethers.provider.getBalance(
        alice.address
    ))*/

}

emitEvent()
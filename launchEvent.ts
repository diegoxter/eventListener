const { artifacts, contract, ethers, network } = require('hardhat')
var readline = require('readline');
const eventTesterABI = require("./abis/EventTester.json")
require('dotenv').config()

async function emitEvent() {
    const [alice] = await ethers.getSigners()

    const eventTesterAddress = "0x6D3931ECd8f4E74FD4Be0790842DdD855a648109"
    const provider = new ethers.providers.WebSocketProvider(
       `https://${process.env.RIVET_KEY}.sepolia.ws.rivet.cloud`
    )
    const contract = new ethers.Contract(eventTesterAddress, eventTesterABI, provider)

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

                console.log (await contract.connect(alice).emitTestEvent())
            
                console.log("Evento lanzado")
                break;
            case 'n':
                console.log('Sorry! Closing');
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
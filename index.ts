const ethers = require('ethers')
const eventTesterABI = require("./abis/EventTester.json")
require('dotenv').config()

async function main() {
    const eventTesterAddress = "0x6D3931ECd8f4E74FD4Be0790842DdD855a648109"
    const provider = new ethers.providers.WebSocketProvider(
       `wss://${process.env.RIVET_KEY}.sepolia.ws.rivet.cloud`
    )
    const contract = new ethers.Contract(eventTesterAddress, eventTesterABI, provider)
    console.log('Connected to: ' + (await provider.getNetwork()).name)

    console.log("Leyendo eventos")
    contract.on('TestEvent', (blockTime, blocknumber, emitter) => {
        let info = {
            blockTime: new Date((ethers.BigNumber.from(blockTime).toNumber())*1000),
            blocknumber: ethers.BigNumber.from(blocknumber).toNumber(),
            emitter: emitter,
        }
        console.log(JSON.stringify(info, null, 4))
    })

   //process.exit()
}

main()
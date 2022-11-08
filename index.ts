const ethers = require('ethers')
const eventTesterABI = require("./abis/EventTester.json")
const eventReceiverABI = require("./abis/EventReceiver.json")
require('dotenv').config()

async function main() {
    const eventTesterAddress = "0x6D3931ECd8f4E74FD4Be0790842DdD855a648109"
    const wssSepolia = new ethers.providers.WebSocketProvider(
       `wss://${process.env.RIVET_KEY}.sepolia.ws.rivet.cloud`
    )
    const eventTester = new ethers.Contract(eventTesterAddress, eventTesterABI, wssSepolia)

    const eventReceiverAddress = "0x4066D3B99dA35D35Cec47425d153154a1649fC5C"
    const wssGoerli = new ethers.providers.WebSocketProvider(
        `wss://${process.env.RIVET_KEY}.goerli.ws.rivet.cloud`
     )
    const eventReceiverListener = new ethers.Contract(eventReceiverAddress, eventReceiverABI, wssGoerli)

    async function sendEventToReceiver() {
        const alice = await ethers.Wallet.fromMnemonic(process.env.MNEMONIC);
        const goerliProvider = new ethers.providers.JsonRpcProvider(
            `https://rpc.ankr.com/eth_goerli`
            )
        const eventReceiver = new ethers.Contract(eventReceiverAddress, eventReceiverABI, goerliProvider)

        /* console.log(BigInt(ethers.BigNumber.from(await goerliProvider.getBalance(
        alice.address
        )))) */

        const tx = await eventReceiver.connect(alice.connect(goerliProvider)).receiveTestEvent()
        console.log("Done! Verify the transaction here: https://goerli.etherscan.io/tx/"+(await tx.hash))
        console.log("Now wait a second transaction here... ... ...")
    }


    console.log('Connected to ' + (await wssSepolia.getNetwork()).name + ' and ' + (await wssGoerli.getNetwork()).name)
    console.log("Waiting for events... ... ...")
    eventTester.on('TestEvent', async (blockTime, blocknumber, emitter) => {
        console.log('EventTester emitted from Sepolia!')
        let info = {
            blockTime: new Date((ethers.BigNumber.from(blockTime).toNumber())*1000),
            blocknumber: ethers.BigNumber.from(blocknumber).toNumber(),
            emitter: emitter,
        }
        console.log(JSON.stringify(info, null, 4))
        console.log("Now let's send a multichain transaction to Goerli...")

       await sendEventToReceiver()
    })

    eventReceiverListener.on('TestEventReceived', (blockTime, blocknumber, emitter) => {
        console.log('EventReceiver emitted from Goerli. Hurray! ')
        let info = {
            blockTime: new Date((ethers.BigNumber.from(blockTime).toNumber())*1000),
            blocknumber: ethers.BigNumber.from(blocknumber).toNumber(),
            emitter: emitter,
        }
        console.log(JSON.stringify(info, null, 4))
    })

}

main()
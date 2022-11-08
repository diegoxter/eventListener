const { artifacts, contract, ethers, network } = require('hardhat')
const eventTesterABI = require("./artifacts/contracts/EventTester.sol/EventTester.json")
require('dotenv').config()

async function emitEvent() {
    const [alice] = await ethers.getSigners()

    const eventTesterAddress = "0x6D3931ECd8f4E74FD4Be0790842DdD855a648109"
    const provider = new ethers.providers.WebSocketProvider(
       `wss://${process.env.RIVET_KEY}.sepolia.ws.rivet.cloud`
    )
    const contract = new ethers.Contract(eventTesterAddress, eventTesterABI, provider)

    await contract.connect(alice).emitTestEvent()

    console.log("Evento lanzado")
    console.log(await ethers.provider.getBalance(
        alice.address
    ))

}

emitEvent()
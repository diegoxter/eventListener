const { artifacts, contract, ethers, network } = require('hardhat')
require('dotenv').config()

async function emitEvent() {
    const EvTestFactory = await ethers.getContractFactory('EventTester')
    const EventTester = await EvTestFactory.deploy()
    await EventTester.deployed()

    console.log(EventTester.address)

    await EventTester.emitTestEvent()
}

emitEvent()
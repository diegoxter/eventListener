//SPDX-License-Identifier:UNLICENSE
pragma solidity ^0.8.17;

contract EventTester {
    event TestEvent(uint blockTime, uint blocknumber, address emitter);

    function emitTestEvent() external {
        emit TestEvent(block.timestamp, block.number, msg.sender);
    }
}
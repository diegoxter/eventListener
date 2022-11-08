//SPDX-License-Identifier:UNLICENSE
pragma solidity ^0.8.17;

contract EventReceiver {
    event TestEventReceived(uint blockTime, uint blocknumber, address emitter);

    function receiveTestEvent() external {
        emit TestEventReceived(block.timestamp, block.number, msg.sender);
    }
}
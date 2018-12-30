pragma solidity ^0.5.0;
// import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

contract gambling1 {

    uint lottery = 1 ether;
    address payable creater;
    bool lock = false;  
    uint maxRange = 100; 
    bool able = false;
    
    constructor() public payable {
        creater = msg.sender;
        
    }

    function enable() public view returns(bool) {
        return able;
    }

    function ini() public payable createrOnly returns(uint){
        require(msg.value >= lottery * 1000);
        able = true;
        return address(this).balance;
    }
    
    modifier unlock() {
        require(!lock);
        lock = true;
        _;
        lock = false;
    }

    function bet() public payable unlock returns(bool) {
        require(msg.value >= lottery && able == true);
        address payable player;
        player = msg.sender;
        bytes32 source = keccak256(abi.encodePacked(now, block.coinbase, creater));
        uint randomNumber = uint(source) % maxRange;
        if (randomNumber % maxRange == 0) {
            player.transfer(lottery * (maxRange-1));
            block.coinbase.transfer(lottery);
        }
        return true;
        // judge();
    }

    /*
    function __callback(bytes32 _queryId, string _result, bytes _proof) external { 
        if (msg.sender != oraclize_cbAddress()) throw;
        if (oraclize_randomDS_proofVerify__returnCode(_queryId, _result, _proof) != 0) {
            // the proof verification has failed, do we need to take any action here? (depends on the use case)
        } 
        else {
            // the proof verification has passed
            // for simplicity of use, let's also convert the random bytes to uint if we need
            uint maxRange = 100; // [maxRange - 1] is the highest uint we want to get.The variable maxRange should never be greater than 2^(8*N), where N is the number of random bytes we had asked the datasource to return
            uint randomNumber = uint(sha3(_result)) % maxRange; // this is an efficient way to get the uint out in the [0, maxRange-1] range
            newRandomNumber_uint(randomNumber); // this is the resulting random number (uint)

            player.transfer(lottery * 99);
        }
    }
    */

    //function judge() public payable {
        /*
        uint N = 7; // number of random bytes we want the datasource to return
        uint delay = 0; // number of seconds to wait before the execution takes place
        uint callbackGas = 200000; // amount of gas we want Oraclize to set for the callback function
        bytes32 queryId = oraclize_newRandomDSQuery(delay, N, callbackGas); // this function internally generates the correct oraclize_query and returns its queryId
        */
    //}
    
    modifier createrOnly(){
        require(msg.sender == creater);
        _;
    }

    function take() public payable createrOnly{
        selfdestruct(creater);
    }
}
pragma solidity ^0.5.00;
// import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

contract gambling0 {
    uint lottery = 1 ether;
    address payable creater;
    uint maxRange = 100;
    uint pool = 0;
    bool lock = false;
    uint win = 0;
    mapping(uint => address payable[]) list;
    
    constructor() public {
        //oraclize_setProof(proofType_Ledger);
        creater = msg.sender;
    }
    
    modifier unlock(){
        require(lock == false);
        _;
    }

    function bet(uint num) public payable unlock {
        require(msg.value >= lottery);
        list[num % maxRange].push(msg.sender);
        pool += lottery;
    }
    
    modifier onlyCreater() {
        require(msg.sender == creater);
        _;
    }
    
    /*
    function __callback(bytes32 _queryId, string _result, bytes _proof) { 
        require(msg.sender != oraclize_cbAddress());
        if (oraclize_randomDS_proofVerify__returnCode(_queryId, _result, _proof) != 0) {
        } 
        else {
            uint win = uint(keccak256(_result)) % maxRange; // this is an efficient way to get the uint out in the [0, maxRange-1] range
            emit newRandomNumber_uint(win); // this is the resulting random number (uint)

            for(uint i = 0; i < list[win].length; i ++) {
                list[win][i].transfer(address(this).balance / list[win].length);
            }
            selfdestruct(creater);
        }

    }
    */

    function endd() public onlyCreater {
        lock = true;
        // uint N = 7; // number of random bytes we want the datasource to return
        // uint delay = 20; // number of seconds to wait before the execution takes place
        // uint callbackGas = 200000; // amount of gas we want Oraclize to set for the callback function
        // bytes32 queryId = oraclize_newRandomDSQuery(delay, N, callbackGas); // this function internally generates the correct oraclize_query and returns its queryId
        bytes32 source = keccak256(abi.encodePacked(now, block.coinbase, creater));
        win = uint(source) % maxRange; // this is an efficient way to get the uint out in the [0, maxRange-1] range
        block.coinbase.transfer(address(this).balance / 99);
        for(uint i = 0; i < list[win].length; i ++) {
            list[win][i].transfer(address(this).balance / list[win].length);
        }
        creater.transfer(address(this).balance);
        lock = false;
        pool = 0;
        
    }

    function getwin() public view returns(uint) {
        return win;
    }
    
    function des() public onlyCreater {
        selfdestruct(creater);
    }

    function getMoneyNum() public view returns(uint) {
        return pool;
    }
}
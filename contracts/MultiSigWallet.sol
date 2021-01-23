pragma solidity 0.8.0;

contract MultiSigWallet {
    address AdminAddress1;
    address AdminAddress2;
    address contractAddress = address(this);
    uint ether_just_received;
    uint public wallet_balance;
    address nomOtherAddress;
    address confirmedOtherAdd;
    address OtherAdd;
    bool public Admin1CertifyTrx;
    bool public Admin2CertifyTrx;
    bool public nomOtherAddressCertifyTrx;
    uint amount;
    address recipient;
    
    mapping (address => uint) public balances;
    
    
    
    
    modifier RequireAdminAdd () {
        require (msg.sender == AdminAddress1 || msg.sender == AdminAddress2, "admin address  absent");
        _;
    }
     
    modifier ValidCaller() {
        require (msg.sender == AdminAddress1 || msg.sender == AdminAddress2 || msg.sender == nomOtherAddress, " you cannot initiate this transaction");
        _;
    }
    
    modifier approvedTrx(){
        require( Admin1CertifyTrx == true && Admin2CertifyTrx == true && nomOtherAddressCertifyTrx == true);
        _;
    }
    
    
    constructor( address _AdminAddress1, address _AdminAddress2) public {
        AdminAddress1 = _AdminAddress1 ;
        AdminAddress2 = _AdminAddress2 ;
    }
    
    
    function NominateTheOtherAddress ( address _nomOtherAddress) public RequireAdminAdd {
        require(_nomOtherAddress != AdminAddress1 && _nomOtherAddress != AdminAddress2 && _nomOtherAddress != address(this), 'use address other than admin adresses and MultiSigWallet contract address' );
        nomOtherAddress = _nomOtherAddress ;
    }
    
    function Admin1CertifySend() public{
        require ( msg.sender == AdminAddress1);
         Admin1CertifyTrx = true;
    }
    
    function Admin2CertifySend() public {
        require ( msg.sender == AdminAddress2);
       Admin2CertifyTrx = true;
    }
    
    function NomOtherAddressCertifySend() public {
        require ( msg.sender == nomOtherAddress);
        nomOtherAddressCertifyTrx = true;
    }    
    
    
    function sendEther (uint _amount, address _recipient) public ValidCaller approvedTrx {
        amount = _amount;
        require (address(this).balance >= amount);
        recipient =  _recipient;
        balances[address(this)] -= amount;
        payable(recipient).transfer(amount);
        Admin1CertifyTrx = false;
        Admin2CertifyTrx = false;
        nomOtherAddressCertifyTrx = false;
    }
    
    fallback ()  payable external{
        
        ether_just_received = msg.value;
    
        balances[address(this)] += msg.value;
        wallet_balance = address(this).balance;
    }
    function etherJustReceived() public view returns ( uint){
        return ether_just_received;
        
    }
    
    function FirstAdminAddress() public view returns (address){
        return AdminAddress1;
    }
    
    function secondAdminAddress () public view returns (address){
        return AdminAddress2;
    }
    
    function ThirdSignatoryAddress() public view returns (address){
        return  nomOtherAddress;
    }
} 
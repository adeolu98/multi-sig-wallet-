const { assert } = require("console");


const MultiSigWallet = artifacts.require('MultiSigWallet');

contract ('MultiSigWallet',function(accounts) {
    let multisigwallet;
    let multisigwalletAddress;
    let adminaddress1 = accounts[0];
    let adminaddress2 = accounts[1];
    before ( async () =>{ 
        multisigwallet =  await MultiSigWallet.new(adminaddress1, adminaddress2);
        multisigwalletAddress = multisigwallet.address 
    });

    describe ('multisigwallet deployment', async() => {
        it ('should nominate another address', async() =>{
            const newAddedAddress = accounts[2];
            await multisigwallet.NominateTheOtherAddress(newAddedAddress);
            const nominatedAddress = await multisigwallet.ThirdSignatoryAddress();
    
            assert(nominatedAddress === newAddedAddress );
        })
    })
    describe ('multisigwallet concensus by signatories', async() => {
        it ('ensure all signatory wallets certify the send transaction', async() =>{
            const newAddedAddress = accounts[2];
            await multisigwallet.Admin1CertifySend({from: accounts[0]});
            const CheckCertificationForAdmin1 = await multisigwallet.Admin1CertifyTrx();
            await multisigwallet.Admin2CertifySend({from: accounts[1]});
            const CheckCertificationForAdmin2 = await multisigwallet.Admin2CertifyTrx();
            await multisigwallet.NomOtherAddressCertifySend({from: accounts[2]});
            const CheckCertificationForNewAdminAdd = await multisigwallet.nomOtherAddressCertifyTrx();

            assert ( CheckCertificationForAdmin1 === true );
            assert (CheckCertificationForAdmin2 === true);
            assert(CheckCertificationForNewAdminAdd === true);
        });
    })
    describe ('multisigwallet performs send transaction sucessfully', async() => {
        it ('ensure all signatory wallets certify the send transaction and multisig wallet performs a send transaction', async() =>{
            
            await multisigwallet.Admin1CertifySend({from: accounts[0]});
            let CheckCertificationForAdmin1 = await multisigwallet.Admin1CertifyTrx();
            await multisigwallet.Admin2CertifySend({from: accounts[1]});
            let CheckCertificationForAdmin2 = await multisigwallet.Admin2CertifyTrx();
            await multisigwallet.NomOtherAddressCertifySend({from: accounts[2]});
            let CheckCertificationForNewAdminAdd = await multisigwallet.nomOtherAddressCertifyTrx();

            assert ( CheckCertificationForAdmin1 === true );
            assert (CheckCertificationForAdmin2 === true);
            assert(CheckCertificationForNewAdminAdd === true);

            await multisigwallet.send(web3.utils.toWei('1', "ether"),{from: accounts[0]});
            multisigwalletbal = await web3.eth.getBalance(multisigwalletAddress);
            multisigwalletbalinETH = await web3.utils.fromWei(multisigwalletbal, 'ether')
            console.log(multisigwalletbalinETH, 'ETH. This is the multisig wallet balance in ether');

            const sendValue = await web3.utils.toWei('0.5', "ether");
            await multisigwallet.sendEther( sendValue, accounts[3], {from: accounts[0]});
            const multisigwalletbalAfterSend = await web3.eth.getBalance(multisigwalletAddress);
            const multisigwalletbalinETHAfterSend = await web3.utils.fromWei(multisigwalletbalAfterSend, 'ether');
            console.log(multisigwalletbalinETHAfterSend, 'ETH. This is the multisig wallet balance in ether after send was initiated by admin address 1');

            const account3bal = await web3.eth.getBalance(accounts[3]);
            const account3balInEth = await web3.utils.fromWei(account3bal, 'ether');
            console.log(account3balInEth, 'THIS IS account 3(the receipient) ETH BAL')

            const account1bal = await web3.eth.getBalance(accounts[0]);
            const account1balInEth = await web3.utils.fromWei(account1bal, 'ether');
            console.log(account1balInEth, 'THIS IS admin address 1  ETH BAL')

            assert(multisigwalletbalinETH === '1' );
            assert (multisigwalletbalinETHAfterSend ==='0.5', 'wallet ballance is unchanged');

            CheckCertificationForAdmin1 = await multisigwallet.Admin1CertifyTrx();
            assert(CheckCertificationForAdmin1 === false);

            CheckCertificationForAdmin2 = await multisigwallet.Admin2CertifyTrx();
            assert(CheckCertificationForAdmin2 === false);

            CheckCertificationForNewAdminAdd = await multisigwallet.nomOtherAddressCertifyTrx();
            assert(CheckCertificationForNewAdminAdd === false);



        });
    })

})
const TronWeb = require('tronweb');

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    headers: { "TRON-PRO-API-KEY": "3cce4886-7d8b-460c-b41e-b294ba6ebd93" },
});

const USDT_CONTRACT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'; // USDT

async function createUnsignedTransfer(from, to, amount) {
    try {
        console.log('Creating TRC20 transfer:', { from, to, amount });

        const realAmount = tronWeb.toBigNumber(amount).multipliedBy(1_000_000); // USDT has 6 decimals

        const parameter = [
            { type: 'address', value: tronWeb.address.toHex(to) },
            { type: 'uint256', value: realAmount.toString() }
        ];

        const options = {
            feeLimit: 10_000_000,
            callValue: 0
        };

        const tx = await tronWeb.transactionBuilder.triggerSmartContract(
            USDT_CONTRACT_ADDRESS,
            'transfer(address,uint256)',
            options,
            parameter,
            from
        );

        if (!tx || !tx.transaction) {
            console.error('❌ triggerSmartContract failed:', tx);
            throw new Error('TriggerSmartContract did not return transaction');
        }

        console.log('✅ Unsigned transfer created successfully:');
        console.log(JSON.stringify(tx.transaction, null, 2)); // Pretty print
        return tx.transaction;

    } catch (error) {
        console.error('❌ Error during tx creation:', error.message || error);
        throw new Error(`Failed to create transaction: ${error.message || error}`);
    }
}

module.exports = {
    createUnsignedTransfer
};
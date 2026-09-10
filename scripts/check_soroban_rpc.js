const StellarSdk = require('@stellar/stellar-sdk');

const TESTNET_RPC_URL = 'https://soroban-testnet.stellar.org';
const rpc = new StellarSdk.rpc.Server(TESTNET_RPC_URL);

async function testRpc() {
  console.log('Testing Soroban RPC health and ledger status...');
  const health = await rpc.getHealth();
  console.log('RPC Health:', health);
  
  const latestLedger = await rpc.getLatestLedger();
  console.log('Latest Testnet Ledger:', latestLedger.sequence, 'Protocol:', latestLedger.protocolVersion);
}

testRpc().catch(console.error);

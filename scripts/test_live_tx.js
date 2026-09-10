const fs = require('fs');
const path = require('path');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');
const StellarSdk = require('@stellar/stellar-sdk');

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
let mnemonic = null;
for (const line of envContent.split('\n')) {
  if (line.trim().startsWith('TESTNET_MNEMONIC=')) {
    mnemonic = line.trim().slice('TESTNET_MNEMONIC='.length).replace(/^["']|["']$/g, '').trim();
  }
}

const seed = bip39.mnemonicToSeedSync(mnemonic);

// Helper to get keypair by index
function getKeypair(index) {
  const dPath = `m/44'/148'/${index}'`;
  const { key } = derivePath(dPath, seed.toString('hex'));
  return StellarSdk.Keypair.fromRawEd25519Seed(key);
}

const organizer1 = getKeypair(0); // GCND3TIW...
const player1    = getKeypair(1); // GCVNHZ5E...
const player2    = getKeypair(3); // GBLLV6KZ...
const player3    = getKeypair(6); // GBE737HO...
const referee1   = getKeypair(2); // GAOOTDMZ...

async function testLiveTx() {
  console.log('Building real Stellar Testnet transaction: Player1 sends 1 XLM test deposit to Organizer1...');
  console.log('Source: Player1 (' + player1.publicKey().slice(0, 8) + '...)');
  console.log('Destination: Organizer1 (' + organizer1.publicKey().slice(0, 8) + '...)');
  
  const sourceAcc = await server.loadAccount(player1.publicKey());
  
  const tx = new StellarSdk.TransactionBuilder(sourceAcc, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: organizer1.publicKey(),
        asset: StellarSdk.Asset.native(),
        amount: '1.0', // Universal test rule: 1 XLM ONLY
      })
    )
    .addMemo(StellarSdk.Memo.text('GGG D1 Test Deposit'))
    .setTimeout(30)
    .build();

  tx.sign(player1);

  console.log('Submitting signed transaction to Stellar Testnet Horizon...');
  const res = await server.submitTransaction(tx);
  console.log('\n[SUCCESS] Live Testnet Transaction Confirmed!');
  console.log('  Tx Hash:     ', res.hash);
  console.log('  Ledger:      ', res.ledger);
  console.log('  StellarExpert:', `https://stellar.expert/explorer/testnet/tx/${res.hash}`);
}

testLiveTx().catch(err => {
  console.error('[FAILED]:', err.response ? err.response.data : err.message);
});

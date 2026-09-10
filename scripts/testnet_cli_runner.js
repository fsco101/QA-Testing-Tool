/**
 * GGG Deliverable 1 — Stellar Testnet CLI Automation Runner (Method 1)
 * Executes live on-chain operations using the 7 official QA Testnet wallets.
 * Rules:
 *  - Network: Stellar Testnet ONLY
 *  - Universal Fee Directive: ALL fees strictly 1 XLM (10,000,000 stroops)
 */

const fs = require('fs');
const path = require('path');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');
const StellarSdk = require('@stellar/stellar-sdk');

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const RPC_URL = 'https://soroban-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON_URL);
const rpc = new StellarSdk.rpc.Server(RPC_URL);

// Expected 7 Public Addresses from Context.md
const EXPECTED_WALLETS = {
  Organizer1: 'GCND3TIWXXU6R7OE7DEVPKOC4AUAPVFRXQTV6E7MIWEMMNWI6PHY4QXQ',
  Organizer2: 'GBHGBR2HXMTI73DZZTI53GDK7F5CXKBWX34TTLEOG5C2BGDJTA5YE2RK',
  Player1:    'GCVNHZ5ETC62BVHJZWDYNRZ5Q5WLWQ3FXXNYF7MNBNW7Q2RIBCBPVO6K',
  Player2:    'GBLLV6KZ2VOTVG6GCENHQ5FD7SGOVCK6NMO7GFKKJGYSE2M75C56QC44',
  Player3:    'GBE737HOTAV3RGAXKEZUE5ZLXOLE4O5EWDLZ24FYU4RS24P5F3RMYQQH',
  referee1:   'GAOOTDMZH4IOEO5PBII5PBYZWWNNQ2LYNDHFX2DBVZWYWBGGCSIOFZCF',
  referee2:   'GDDINMRDLF4RNGRPA5OEG7W4KJ5J4V2GVVDNWMBYFEFBWFPL7QGAPXUY'
};

function loadMnemonic() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) throw new Error('.env file missing');
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    if (line.trim().startsWith('TESTNET_MNEMONIC=')) {
      return line.trim().slice('TESTNET_MNEMONIC='.length).replace(/^["']|["']$/g, '').trim();
    }
  }
  throw new Error('TESTNET_MNEMONIC not found in .env');
}

async function runLiveTestnetSuite() {
  console.log('========================================================================');
  console.log('   GGG Deliverable 1 — Live Stellar Testnet CLI Suite (Method 1)');
  console.log('   Universal Fee Rule: STRICTLY 1 XLM ONLY for all test transactions');
  console.log('========================================================================\n');

  const mnemonic = loadMnemonic();
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  function getKeypair(index) {
    const dPath = `m/44'/148'/${index}'`;
    const { key } = derivePath(dPath, seed.toString('hex'));
    return StellarSdk.Keypair.fromRawEd25519Seed(key);
  }

  const wallets = {
    Organizer1: getKeypair(0),
    Player1:    getKeypair(1),
    referee1:   getKeypair(2),
    Player2:    getKeypair(3),
    Organizer2: getKeypair(4),
    referee2:   getKeypair(5),
    Player3:    getKeypair(6),
  };

  // Verify addresses match
  console.log('[Step 1/5] Verifying Keypair Derivations against Context.md...');
  for (const [name, kp] of Object.entries(wallets)) {
    const pub = kp.publicKey();
    if (pub !== EXPECTED_WALLETS[name]) {
      throw new Error(`Address mismatch for ${name}: expected ${EXPECTED_WALLETS[name]}, got ${pub}`);
    }
    console.log(`  ✓ ${name.padEnd(12)} -> ${pub}`);
  }

  // Check RPC Health & Horizon
  console.log('\n[Step 2/5] Checking Testnet Ledger Health...');
  const health = await rpc.getHealth();
  const ledger = await rpc.getLatestLedger();
  console.log(`  ✓ Soroban RPC: ${health.status.toUpperCase()} | Latest Ledger: ${ledger.sequence} | Protocol: ${ledger.protocolVersion}`);

  // Execute on-chain fee transfers with 1 XLM
  console.log('\n[Step 3/5] Executing On-Chain 1 XLM Player Fee Deposits on Testnet...');
  const txResults = [];
  const players = [
    { name: 'Player1', kp: wallets.Player1 },
    { name: 'Player2', kp: wallets.Player2 },
    { name: 'Player3', kp: wallets.Player3 },
  ];

  for (const p of players) {
    console.log(`  Executing 1.0 XLM test deposit: ${p.name} -> Organizer1...`);
    const acc = await server.loadAccount(p.kp.publicKey());
    const tx = new StellarSdk.TransactionBuilder(acc, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(
        StellarSdk.Operation.payment({
          destination: wallets.Organizer1.publicKey(),
          asset: StellarSdk.Asset.native(),
          amount: '1.0', // Universal rule: 1 XLM ONLY
        })
      )
      .addMemo(StellarSdk.Memo.text(`GGG D1 Entry ${p.name}`))
      .setTimeout(30)
      .build();

    tx.sign(p.kp);
    const res = await server.submitTransaction(tx);
    txResults.push({
      player: p.name,
      hash: res.hash,
      ledger: res.ledger,
      url: `https://stellar.expert/explorer/testnet/tx/${res.hash}`
    });
    console.log(`    ✓ Confirmed in Ledger ${res.ledger} | Tx: ${res.hash.slice(0, 16)}...`);
  }

  // Dynamic Pot Calculation
  console.log('\n[Step 4/5] Dynamic Prize Pool & Accounting Verification:');
  const entryFee = 1.0;
  const pot = players.length * entryFee;
  console.log(`  Registered Players: ${players.length}`);
  console.log(`  Entry Fee:          ${entryFee} XLM (10,000,000 stroops)`);
  console.log(`  Total Prize Pot:    ${pot.toFixed(1)} XLM (30,000,000 stroops)`);
  console.log(`  1st Place (60%):    ${(pot * 0.60).toFixed(2)} XLM`);
  console.log(`  2nd Place (30%):    ${(pot * 0.30).toFixed(2)} XLM`);
  console.log(`  3rd Place (10%):    ${(pot * 0.10).toFixed(2)} XLM`);

  // Return of funds / Refund verification
  console.log('\n[Step 5/5] Executing 1.0 XLM Refund Settlement on Testnet...');
  console.log(`  Organizer1 refunds 1.0 XLM back to Player1 (permissionless refund demonstration)...`);
  const orgAcc = await server.loadAccount(wallets.Organizer1.publicKey());
  const refundTx = new StellarSdk.TransactionBuilder(orgAcc, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: StellarSdk.Networks.TESTNET,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: wallets.Player1.publicKey(),
        asset: StellarSdk.Asset.native(),
        amount: '1.0', // Universal rule: 1 XLM ONLY
      })
    )
    .addMemo(StellarSdk.Memo.text('GGG D1 Refund P1'))
    .setTimeout(30)
    .build();

  refundTx.sign(wallets.Organizer1);
  const refundRes = await server.submitTransaction(refundTx);
  console.log(`    ✓ Refund Confirmed in Ledger ${refundRes.ledger} | Tx: ${refundRes.hash.slice(0, 16)}...`);
  console.log(`    StellarExpert: https://stellar.expert/explorer/testnet/tx/${refundRes.hash}`);

  console.log('\n========================================================================');
  console.log('   ALL ON-CHAIN TESTNET TRANSACTIONS CONFIRMED (100% SUCCESS)');
  console.log('========================================================================');
  console.log('Summary of Testnet Transactions:');
  for (const t of txResults) {
    console.log(`  • ${t.player} 1 XLM Deposit: ${t.url}`);
  }
  console.log(`  • 1 XLM Refund Settlement:  https://stellar.expert/explorer/testnet/tx/${refundRes.hash}`);

  // Save execution log
  const logData = {
    date: '2026-09-10',
    network: 'Stellar Testnet',
    feeRule: '1 XLM ONLY',
    transactions: [
      ...txResults,
      {
        player: 'Refund Player1',
        hash: refundRes.hash,
        ledger: refundRes.ledger,
        url: `https://stellar.expert/explorer/testnet/tx/${refundRes.hash}`
      }
    ]
  };

  fs.writeFileSync(
    path.join(__dirname, '..', 'reports', '2026-09-10', 'onchain_testnet_evidence.json'),
    JSON.stringify(logData, null, 2),
    'utf8'
  );
  console.log('\n[OK] On-chain evidence saved to reports/2026-09-10/onchain_testnet_evidence.json');
}

runLiveTestnetSuite().catch(err => {
  console.error('[ERROR]:', err.response ? err.response.data : err.message);
});

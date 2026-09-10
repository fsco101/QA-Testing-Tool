const fs = require('fs');
const path = require('path');
const bip39 = require('bip39');
const { derivePath } = require('ed25519-hd-key');
const StellarSdk = require('@stellar/stellar-sdk');

const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
let mnemonic = null;
for (const line of envContent.split('\n')) {
  if (line.trim().startsWith('TESTNET_MNEMONIC=')) {
    mnemonic = line.trim().slice('TESTNET_MNEMONIC='.length).replace(/^["']|["']$/g, '').trim();
  }
}

if (!mnemonic) {
  console.log('No mnemonic found in .env');
  process.exit(1);
}

console.log('Mnemonic words count:', mnemonic.split(/\s+/).length);
console.log('Is valid mnemonic?:', bip39.validateMnemonic(mnemonic));

const seed = bip39.mnemonicToSeedSync(mnemonic);

const EXPECTED_WALLETS = {
  Organizer1: 'GCND3TIWXXU6R7OE7DEVPKOC4AUAPVFRXQTV6E7MIWEMMNWI6PHY4QXQ',
  Organizer2: 'GBHGBR2HXMTI73DZZTI53GDK7F5CXKBWX34TTLEOG5C2BGDJTA5YE2RK',
  Player1:    'GCVNHZ5ETC62BVHJZWDYNRZ5Q5WLWQ3FXXNYF7MNBNW7Q2RIBCBPVO6K',
  Player2:    'GBLLV6KZ2VOTVG6GCENHQ5FD7SGOVCK6NMO7GFKKJGYSE2M75C56QC44',
  Player3:    'GBE737HOTAV3RGAXKEZUE5ZLXOLE4O5EWDLZ24FYU4RS24P5F3RMYQQH',
  referee1:   'GAOOTDMZH4IOEO5PBII5PBYZWWNNQ2LYNDHFX2DBVZWYWBGGCSIOFZCF',
  referee2:   'GDDINMRDLF4RNGRPA5OEG7W4KJ5J4V2GVVDNWMBYFEFBWFPL7QGAPXUY'
};

console.log('\nTesting SEP-0005 derivations m/44\'/148\'/{i}\':');
let matchCount = 0;
for (let i = 0; i < 20; i++) {
  const dPath = `m/44'/148'/${i}'`;
  const { key } = derivePath(dPath, seed.toString('hex'));
  const keypair = StellarSdk.Keypair.fromRawEd25519Seed(key);
  const pub = keypair.publicKey();
  
  for (const [name, exp] of Object.entries(EXPECTED_WALLETS)) {
    if (pub === exp) {
      matchCount++;
      console.log(`  ✓ MATCH! Index ${i} (${dPath}) matches ${name}: ${pub}`);
    }
  }
}
console.log(`\nMatched ${matchCount} / 7 wallets from mnemonic.`);

// Wallet state
let isWalletConnected = false;
let walletAddress = null;

// DOM elements
const connectWalletBtn = document.getElementById('connectWallet');
const connectWalletHeroBtn = document.getElementById('connectWalletHero');
const walletModal = document.getElementById('walletModal');
const slushWalletBtn = document.getElementById('slushWallet');
const closeModalBtn = document.getElementById('closeModal');
const playCoinflipBtn = document.getElementById('playCoinflip');
const coinflipGuess = document.getElementById('coinflipGuess');
const coinflipResult = document.getElementById('coinflipResult');
const buyLootboxBtn = document.getElementById('buyLootbox');
const lootboxResult = document.getElementById('lootboxResult');
const rollDiceBtn = document.getElementById('rollDice');
const diceGuess = document.getElementById('diceGuess');
const diceResult = document.getElementById('diceResult');

// Wallet connection function
async function connectSlushWallet() {
  try {
    // Check for Sui SDK
    if (!window.Sui) {
      console.error('Sui SDK not loaded. Expected local file: /sui.js');
      throw new Error('Sui SDK failed to load. Please ensure the /sui.js file is correctly deployed and accessible. Check console for details.');
    }
    console.log('Sui SDK loaded successfully from /sui.js');

    // Initialize SuiClient with fallback RPCs
    const { SuiClient } = window.Sui;
    const client = new SuiClient({
      url: 'https://fullnode.mainnet.sui.io',
      fallbackUrls: [
        'https://rpc.mainnet.sui.io',
        'https://sui-mainnet.rpcpool.com'
      ]
    });
    console.log('SuiClient initialized with Mainnet RPC.');

    // Check for Slush Wallet
    const slushWallet = window.suiWallet;
    if (!slushWallet) {
      console.error('Slush Wallet not detected.');
      throw new Error('Slush Wallet extension not detected. Please install it from the Chrome Web Store, ensure it is enabled, and set to Sui Mainnet.');
    }
    console.log('Slush Wallet detected.');

    // Request connection permissions
    console.log('Requesting wallet permissions...');
    await slushWallet.requestPermissions();

    // Get wallet accounts
    console.log('Fetching wallet accounts...');
    const accounts = await slushWallet.getAccounts();
    if (accounts.length === 0) {
      console.error('No accounts found in Slush Wallet.');
      throw new Error('No accounts found in Slush Wallet. Please set up or import an account.');
    }

    // Store first account address
    isWalletConnected = true;
    walletAddress = accounts[0];
    connectWalletBtn.textContent = `Connected: ${walletAddress.slice(0, 6)}...`;
    connectWalletBtn.classList.remove('btn-primary');
    connectWalletBtn.classList.add('btn-success');
    walletModal.classList.add('hidden');
    console.log(`Connected to Slush Wallet: ${walletAddress}`);
  } catch (error) {
    console.error('Wallet connection error:', error);
    alert(`Failed to connect: ${error.message}`);
    walletModal.classList.add('hidden');
  }
}

// Event listeners for wallet connection
connectWalletBtn.addEventListener('click', () => {
  console.log('Opening wallet modal from header.');
  walletModal.classList.remove('hidden');
});

connectWalletHeroBtn.addEventListener('click', () => {
  console.log('Opening wallet modal from hero.');
  walletModal.classList.remove('hidden');
});

slushWalletBtn.addEventListener('click', () => {
  console.log('Slush Wallet button clicked.');
  connectSlushWallet();
});

closeModalBtn.addEventListener('click', () => {
  console.log('Closing wallet modal.');
  walletModal.classList.add('hidden');
});

// Coinflip game simulation (no SUI)
playCoinflipBtn.addEventListener('click', () => {
  if (!isWalletConnected) {
    alert('Please connect your wallet first!');
    return;
  }
  const guess = coinflipGuess.value;
  const result = Math.random() < 0.5 ? 'heads' : 'tails';
  const won = guess === result;
  coinflipResult.textContent = `Result: ${result.toUpperCase()}! You ${won ? 'won' : 'lost'}!`;
  coinflipResult.classList.remove('text-red');
  coinflipResult.classList.add(won ? 'text-green' : 'text-red');
});

// Lootbox (disabled, coming soon)
buyLootboxBtn.addEventListener('click', () => {
  lootboxResult.textContent = 'Lootboxes are coming soon!';
  lootboxResult.classList.add('text-navy');
});

// Dice game simulation (no SUI)
rollDiceBtn.addEventListener('click', () => {
  if (!isWalletConnected) {
    alert('Please connect your wallet first!');
    return;
  }
  const guess = parseInt(diceGuess.value);
  const result = Math.floor(Math.random() * 6) + 1;
  const won = guess === result;
  diceResult.textContent = `Rolled: ${result}! You ${won ? 'won' : 'lost'}!`;
  diceResult.classList.remove('text-red');
  diceResult.classList.add(won ? 'text-green' : 'text-red');
});
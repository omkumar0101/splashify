// Wallet state
let isWalletConnected = false;
let walletAddress = null;

// DOM elements
const connectWalletBtn = document.getElementById('connectWallet');
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
    // Check for Sui SDK with extended retry
    if (!window.Sui) {
      console.warn('Sui SDK not loaded. Retrying in 1 second...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
      if (!window.Sui) {
        console.error('Sui SDK still not loaded. Checking network and browser settings.');
        throw new Error('Sui SDK failed to load. Please disable ad-blockers, check your network, or try a different browser (e.g., Chrome).');
      }
    }
    console.log('Sui SDK loaded successfully.');

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
      throw new Error('Slush Wallet extension not detected. Please install it from the Chrome Web Store or ensure it is enabled and set to Sui Mainnet.');
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
    connectWalletBtn.classList.remove('bg-pink');
    connectWalletBtn.classList.add('bg-green');
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
  if (!isWalletConnected) {
    console.log('Opening wallet modal.');
    walletModal.classList.remove('hidden');
  } else {
    console.log('Disconnecting wallet.');
    isWalletConnected = false;
    walletAddress = null;
    connectWalletBtn.textContent = 'Connect Wallet';
    connectWalletBtn.classList.remove('bg-green');
    connectWalletBtn.classList.add('bg-pink');
    alert('Wallet disconnected');
  }
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
  coinflipResult.classList.remove('text-red-500');
  coinflipResult.classList.add(won ? 'text-green-500' : 'text-red-500');
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
  const result = Math.floor(Math.random() * 6) + 1; // Random 1–6
  const won = guess === result;
  diceResult.textContent = `Rolled: ${result}! You ${won ? 'won' : 'lost'}!`;
  diceResult.classList.remove('text-red-500');
  diceResult.classList.add(won ? 'text-green-500' : 'text-red-500');
});
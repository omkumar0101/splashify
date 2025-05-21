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
    // Initialize SuiClient for Mainnet
    const { SuiClient } = window.Sui; // Loaded via script or module
    const client = new SuiClient({ url: 'https://fullnode.mainnet.sui.io' });

    // Check for Slush Wallet extension
    const slushWallet = window.suiWallet;
    if (!slushWallet) {
      throw new Error('Slush Wallet extension not detected. Please install it from the Chrome Web Store.');
    }

    // Request connection permissions
    await slushWallet.requestPermissions();

    // Get wallet accounts
    const accounts = await slushWallet.getAccounts();
    if (accounts.length === 0) {
      throw new Error('No accounts found in Slush Wallet. Please set up your wallet.');
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
    walletModal.classList.remove('hidden');
  } else {
    isWalletConnected = false;
    walletAddress = null;
    connectWalletBtn.textContent = 'Connect Wallet';
    connectWalletBtn.classList.remove('bg-green');
    connectWalletBtn.classList.add('bg-pink');
    alert('Wallet disconnected');
  }
});

slushWalletBtn.addEventListener('click', () => {
  connectSlushWallet();
});

closeModalBtn.addEventListener('click', () => walletModal.classList.add('hidden'));

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
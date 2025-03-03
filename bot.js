const { Client, GatewayIntentBits } = require('discord.js');
const { ethers } = require('ethers');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const TOKEN_AMOUNT = ethers.parseEther("0.5");  // 送付する量（MONの場合）

// 送金リクエストのキューを管理する配列
const transactionQueue = [];

async function processQueue() {
  if (transactionQueue.length === 0) return; // キューが空なら何もしない
  const { message, address } = transactionQueue.shift(); // 先頭のリクエストを取得

  try {
    const tx = await wallet.sendTransaction({
      to: address,
      value: TOKEN_AMOUNT,
    });
    await message.reply(`Sent MON!TX: ${tx.hash}`);
  } catch (err) {
    console.error(err);
    await message.reply('Error');
  }

  // 次のリクエストを処理
  if (transactionQueue.length > 0) {
    processQueue();
  }
}

client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!baklin')) {
    const address = message.content.split(' ')[1];

    if (!ethers.isAddress(address)) {
      return await message.reply('Please enter it again');
    }

    transactionQueue.push({ message, address });

    if (transactionQueue.length === 1) {
      processQueue(); // キューが空だった場合のみ処理を開始
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

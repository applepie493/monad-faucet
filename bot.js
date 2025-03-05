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

console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const TOKEN_AMOUNT = ethers.parseEther("0.5");  // 送付する量（MONの場合）

// 🚀 送金リクエストのキュー & フラグ
const transactionQueue = [];
let isProcessing = false;

// 🚀 キューを処理する関数
async function processQueue() {
  if (isProcessing || transactionQueue.length === 0) return;

  isProcessing = true;
  const { message, address } = transactionQueue.shift();

  try {
    const tx = await wallet.sendTransaction({
      to: address,
      value: TOKEN_AMOUNT,
    });
    await message.reply(`✅ Sent! TX: ${tx.hash}`);
  } catch (err) {
    console.error(err);
    await message.reply("⚠️ An error occurred. Please try again.");
  }

  isProcessing = false;

  // キューが残っていれば次を処理
  if (transactionQueue.length > 0) {
    processQueue();
  }
}

// 🚀 メッセージが送信されたときの処理
client.on('messageCreate', async (message) => {
  if (!ethers.isAddress(message.content)) return; // アドレス以外無視

  transactionQueue.push({ message, address: message.content });

  if (!isProcessing) {
    processQueue();  // キューが空なら処理開始
  } else {
    await message.reply("🕒 Waiting for processing. Please wait your turn.");
  }
});

// 🚀 Bot をログイン
client.login(process.env.DISCORD_TOKEN);



/*const { Client, GatewayIntentBits } = require('discord.js');
const { ethers } = require('ethers');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});
console.log("PRIVATE_KEY:", process.env.PRIVATE_KEY);
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
/*
client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!mona')) {
    const address = message.content.split(' ')[1];

    if (!ethers.isAddress(address)) {
      return await message.reply('Please enter it again');
    }

    transactionQueue.push({ message, address });

    if (transactionQueue.length === 1) {
      processQueue(); // キューが空だった場合のみ処理を開始
    }
  }
});*/

/*client.on('messageCreate', async (message) => {
  const content = message.content.trim();

  // アドレスのみの場合 or "!baklin <address>" の場合に反応
  if (ethers.isAddress(content) || content.startsWith('!mona')) {
    const address = content.startsWith('!mona') ? content.split(' ')[1] : content;

    if (!ethers.isAddress(address)) {
      return await message.reply('Please enter it again');
    }

    transactionQueue.push({ message, address });

    if (transactionQueue.length === 1) {
      processQueue(); // キューが空だった場合のみ処理を開始
    }
  }
});*/ //多数リクエストが多くエラーになるため修正

/*フラグ制御・・・変なエラーがでる
let isProcessing = false;  // フラグを用意

client.on('messageCreate', async (message) => {
  if (!ethers.isAddress(message.content)) return; // アドレス以外無視

  if (isProcessing) {
    return await message.reply("🚫 Processing in progress. Please wait.");
  }

  isProcessing = true; // フラグON

  try {
    const tx = await wallet.sendTransaction({
      to: message.content,
      value: TOKEN_AMOUNT,
    });
    await message.reply(`✅ MON を送付しました！TX: ${tx.hash}`);
  } catch (err) {
    console.error(err);
    await message.reply("⚠️ An error occurred. Please try again.");
  }

  isProcessing = false; // 処理が終わったらフラグOFF
});*/

/*const transactionQueue = [];
let isProcessing = false;

async function processQueue() {
  if (isProcessing || transactionQueue.length === 0) return;

  isProcessing = true;
  const { message, address } = transactionQueue.shift();

  try {
    const tx = await wallet.sendTransaction({
      to: address,
      value: TOKEN_AMOUNT,
    });
    await message.reply(`✅ Sent！TX: ${tx.hash}`);
  } catch (err) {
    console.error(err);
    await message.reply("⚠️ An error occurred. Please try again.");
  }

  isProcessing = false;

  if (transactionQueue.length > 0) {
    processQueue();  // 次のリクエストを処理
  }
}

client.on('messageCreate', async (message) => {
  if (!ethers.isAddress(message.content)) return; // アドレス以外無視

  transactionQueue.push({ message, address: message.content });
  
  if (!isProcessing) {
    processQueue();  // キューが空なら処理開始
  } else {
    await message.reply("🕒 Waiting for processing. Please wait your turn.");
  }
});


client.login(process.env.DISCORD_TOKEN);*/

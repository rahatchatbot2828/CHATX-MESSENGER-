      /**
 * Wingo Game Bot Command
 * Author: Rahat Mahmud
 * Version: 1.0
 */

const fs = require("fs");
const path = require("path");

// JSON file same folder e
const DATA_PATH = path.join(__dirname, "wingoMoney.json");

// Game images
const GAME_IMG = "https://files.catbox.moe/ictaql.jpg";
const WIN_IMG  = "https://files.catbox.moe/7i9qf0.jpg";

// Last 10 results
const history = [];

// Helper functions
function loadData() { return fs.existsSync(DATA_PATH) ? JSON.parse(fs.readFileSync(DATA_PATH,"utf8")) : {}; }
function saveData(data) { fs.writeFileSync(DATA_PATH, JSON.stringify(data,null,2)); }
function getUser(data, uid) { if(!data[uid]) data[uid]={money:0,lastDaily:0}; return data[uid]; }
function colorOf(n) { if([1,3,7,9].includes(n)) return "red"; if([2,4,6,8].includes(n)) return "green"; return "violet"; }
function sizeOf(n) { return n>=5?"big":"small"; }

module.exports = {
  name: "wingo",
  author: "Rahat Mahmud",
  version: "1.0",
  async execute(message,args,prefix) {
    const uid = message.senderID;
    const data = loadData();
    const user = getUser(data,uid);

    // DAILY
    if(args[0]==="daily"){
      const now = Date.now();
      const day = 86400000;
      if(now-user.lastDaily<day) return message.reply("⏳ আজকে daily নেওয়া হয়েছে!");
      user.money += 100;
      user.lastDaily = now;
      saveData(data);
      return message.reply(`🎁 Daily Reward\n💰 +100 TK\n💳 Balance: ${user.money} TK`);
    }

    // LEADERBOARD
    if(args[0]==="leaderboard"){
      const top = Object.entries(data).sort((a,b)=>b[1].money-a[1].money).slice(0,10);
      let text = "🏆 Wingo Leaderboard 🏆\n\n";
      top.forEach((u,i)=>text+=`${i+1}. ${u[0]} — ${u[1].money} TK\n`);
      return message.reply(text);
    }

    // BET
    if(args[0]==="bet"){
      const amount = parseInt(args[1]);
      const option = args[2];
      if(!amount||amount<=0) return message.reply("❌ Amount ভুল!");
      if(user.money<amount) return message.reply("❌ পর্যাপ্ত টাকা নেই!");
      if(!["red","green","big","small"].includes(option)) return message.reply("❌ Option ভুল!");

      user.money -= amount;
      saveData(data);

      const his = history.map(h=>`${h.num}(${h.color})`).join(", ")||"N/A";

      const start = await message.reply({body:`🎰 WINGO START\n\n💸 Bet: ${amount} TK on ${option}\n📊 Last 10: ${his}\n⏳ Time: 30s`, attachment: GAME_IMG});
      await new Promise(r=>setTimeout(r,10000));
      await message.edit(start.messageID,"⏳ Time: 20s");
      await new Promise(r=>setTimeout(r,10000));
      await message.edit(start.messageID,"⏳ Time: 10s");
      await new Promise(r=>setTimeout(r,10000));

      const num = Math.floor(Math.random()*10);
      const color = colorOf(num);
      const size = sizeOf(num);

      history.push({num,color});
      if(history.length>10) history.shift();

      const win = option===color||option===size;
      const reward = win ? amount*2 : 0;
      if(win) user.money += reward;
      saveData(data);

      const resultText = `🎯 RESULT\n\n🔢 ${num}\n🎨 ${color}\n📏 ${size}\n\n${win?"🎉 YOU WIN":"😢 YOU LOSE"}\n💳 Balance: ${user.money} TK`;
      if(win) return message.reply({body:resultText, attachment:WIN_IMG});
      else return message.reply(resultText);
    }

    // HELP
    return message.reply(`🎰 Wingo Commands\n\n${prefix}wingo daily\n${prefix}wingo bet <amount> <red/green/big/small>\n${prefix}wingo leaderboard`);
  }
};

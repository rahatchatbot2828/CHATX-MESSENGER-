/**
 * Wingo Add Money Command
 * Author: Rahat Mahmud
 * Version: 1.0
 */

const fs = require("fs");
const path = require("path");

// JSON file same folder e
const DATA_PATH = path.join(__dirname, "wingoMoney.json");

function loadData() { return fs.existsSync(DATA_PATH)?JSON.parse(fs.readFileSync(DATA_PATH,"utf8")):{}; }
function saveData(data) { fs.writeFileSync(DATA_PATH,JSON.stringify(data,null,2)); }
function getUser(data, uid) { if(!data[uid]) data[uid]={money:0,lastDaily:0}; return data[uid]; }

module.exports = {
  name:"add",
  author:"Rahat Mahmud",
  version:"1.0",
  execute(message,args){
    if(!message.isAdmin) return message.reply("❌ Admin only!");
    if(args[0]!=="wingo"||args[1]!=="money") return;
    if(!message.messageReply) return message.reply("❌ Reply করে ব্যবহার করুন!");
    const amount = parseInt(args[2]);
    if(!amount||amount<=0) return message.reply("❌ Amount ভুল!");

    const target = message.messageReply.senderID;
    const data = loadData();
    const user = getUser(data,target);
    user.money += amount;
    saveData(data);
    return message.reply(`✅ Money Added\n👤 ${target}\n💰 +${amount} TK`);
  }
};

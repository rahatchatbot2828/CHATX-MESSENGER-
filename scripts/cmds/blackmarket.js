const axios = require("axios");

const cmdsInfoUrl = "https://raw.githubusercontent.com/Azadwebapi/Azadx69x-blackmarket-top/refs/heads/main/cmdsinfo.json";
const cmdsUrlJson = "https://raw.githubusercontent.com/Azadwebapi/Azadx69x-blackmarket-top/refs/heads/main/cmdsurl.json";
const ITEMS_PER_PAGE = 10;

module.exports = {
  config: {
    name: "blackmarket",
    aliases: ["bm"],
    version: "1.2",
    author: "Azadx69x",//kichu change korle tor abbu lagi
    role: 0,
    shortDescription: "List or show blackmarket commands",
    category: "market"
  },

  onStart: async function({ message, args }) {
    try {
      const action = args[0]?.toLowerCase();

      if (!action) {  
        return message.reply(  
          `✨𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 𝗕𝗹𝗮𝗰𝗸 𝗠𝗮𝗿𝗸𝗲𝘁 ✨
👤 Author: Rahat
━━━━━━━━━━━━━━━━━━━━
Type )bm list <page> to see all commands.
Type )bm show <command>.js to get the raw link.`  
        );  
      }  

      const [infoRes, urlRes] = await Promise.all([  
        axios.get(cmdsInfoUrl),  
        axios.get(cmdsUrlJson)  
      ]);  

      let cmdsInfo = infoRes.data;  
      if (cmdsInfo.cmdName) cmdsInfo = cmdsInfo.cmdName;  

      const cmdsUrls = urlRes.data;  
        
      if (action === "list") {  
        if (!Array.isArray(cmdsInfo) || cmdsInfo.length === 0)  
          return message.reply("❌ No commands found!");  

        const page = parseInt(args[1]) || 1;  
        const totalPages = Math.ceil(cmdsInfo.length / ITEMS_PER_PAGE);  

        if (page < 1 || page > totalPages)  
          return message.reply(`❌ Invalid page number! 1-${totalPages}`);  

        const start = (page - 1) * ITEMS_PER_PAGE;  
        const cmdsPage = cmdsInfo.slice(start, start + ITEMS_PER_PAGE);  

        let text = `☠️ 𝗕𝗹𝗮𝗰𝗸 𝗠𝗮𝗿𝗸𝗲𝘁 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁 ☠️
👤 Author: Rahat
━━━━━━━━━━━━━━━━━━━━
`;

        cmdsPage.forEach((c, i) => {  
          text += `🪪 𝙽𝚞𝚖𝚋𝚎𝚛 : ${start + i + 1}  
🛒 𝙽𝚊𝚖𝚎   : ${c.cmd}  
⚙️ 𝚄𝚙𝚍𝚊𝚝𝚎 : ${c.update}  
👨‍💻 𝙰𝚞𝚝𝚑𝚘𝚛 : ${c.author}  
━━━━━━━━━━━━━━━━━━━━
`;
        });

        if (page < totalPages)  
          text += `📑 Type ")bm list ${page + 1}" for next page.`;  

        return message.reply(text.trim());  
      }  
        
      if (action === "show") {  
        const cmdName = args[1]?.replace(".js", "");  
        if (!cmdName)  
          return message.reply("❌ Example: )bm show anime.js");  

        const cmd = cmdsInfo.find(c => c.cmd.toLowerCase() === cmdName.toLowerCase());  
        const cmdUrl = cmdsUrls[cmdName];  

        if (!cmd || !cmdUrl)  
          return message.reply(`❌ Command "${cmdName}" not found!`);  

        const now = new Date().toLocaleString("en-GB");  

        const boxText = `╭──𝐂𝐦𝐝 𝐔𝐩𝐥𝐨𝐚𝐝𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥──╮
┆~📝 𝗡𝗮𝗺𝗲
╰─❯ ${cmdName}
┆~👨‍💻 𝗔𝘂𝘁𝗵𝗼𝗿
╰─❯ ${cmd.author}
┆~📅 𝗨𝗽𝗱𝗮𝘁𝗲𝗱 𝗔𝘁
╰─❯ ${now}
┆~⚡ 𝗦𝘁𝗮𝘁𝘂𝘀
╰─❯ ✅ Uploaded Successfully
┆~📌 𝗥𝗮𝘄 𝗙𝗶𝗹𝗲 𝗟𝗶𝗻𝗸
╰─❯ ${cmdUrl}
╰────────────────────╯`;

        return message.reply(boxText);  
      }  

      return message.reply("❌ Invalid option!");  

    } catch (err) {  
      return message.reply(`❌ Error: ${err.message}`);  
    }
  }
};

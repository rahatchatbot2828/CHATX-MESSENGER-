module.exports = {
  config: {
    name: "owner",
    version: 3.7,
    author: "Rahat",
    longDescription: "Stylish hardcoded owner & bot info card with emojis",
    category: "Special",
    guide: {
      en: "{p}{n}",
    },
  },

  onStart: async function ({ message }) {

    const media = "https://files.catbox.moe/dtpbnv.jpg";

    let attachment;
    try {
      attachment = await global.utils.getStreamFromURL(media);
    } catch {
      attachment = null;
    }

    const body = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
╭─╼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╾─╮
│           👑 OWNER INFO 👑
│
│ 🧑‍💼 Name       : 𝐑𝐀𝐇𝐀𝐓
│ 🪪 Username   : rahatmahmud
│ 🎂 Birthday   : 21 Nov
│ 🐸 Age        : 15+
│ 📚 Study      : 10
│ 💕 Relation   : Single
│ 📱 Contact    : 01828832911
│ ✉️ Email      : rahatmahmud929@gmail.com
│ 🌍 Location   : Barihal, Bangladesh
│ 🕋 Religion   : Islam
│ 🌐 Facebook   : https://www.facebook.com/rahat122485
│ 🎮 Hobby      : Gaming
│ 💻 Skill      : 𝐆𝐨𝐫𝐢𝐛𝐞𝐫 𝐚𝐛𝐫 𝐬𝐤𝐢𝐥𝐥
│ 🎵 Fav Song   : sesh-kanna
│ 🕐 Timezone   : GMT+6 (Bangladesh)
│
│           🤖 BOT INFO 🤖
│
│ 🛠 Bot Name   : ✰🪽°ℝ𝕀ℕ ℕ𝕆ℍ𝔸ℝ𝔸°🐰࿐
│ 🔰 Prefix     : )
│ 👑 Author     : 𝐑𝐀𝐇𝐀𝐓
│
│         ⚡ 𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘 𝐑𝐀𝐇𝐀𝐓 ⚡
╰─╼━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╾─╯
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;

    message.reply({
      body,
      attachment
    });
  }
};

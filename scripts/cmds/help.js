const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "3.1",
    author: "RAHAT",
    countDown: 5,
    role: 0,
    description: { en: "View commands list with categories or command details" },
    category: "info"
  },

  onStart: async function({ message, args, event, role }) {
    const prefix = getPrefix(event.threadID);
    const commandName = (args[0] || "").toLowerCase();
    const cmd = commands.get(commandName) || commands.get(aliases.get(commandName));

    const roleText = r =>
      r === 0 ? "All Users"
      : r === 1 ? "Group Admins"
      : "Bot Admins";

    // ===== COMMAND DETAILS =====
    if (cmd) {
      const cfg = cmd.config;

      const msg = `
╔════════════════════╗
        ⚡ COMMAND INFO ⚡
╚════════════════════╝

🧩 Name       : ${cfg.name}
📝 Description: ${
        typeof cfg.description === "string"
          ? cfg.description
          : cfg.description?.en || "No description"
      }

👤 Author     : ${cfg.author || "Unknown"}
🔖 Version    : ${cfg.version || "1.0"}
🔐 Role       : ${roleText(cfg.role || 0)}
⏱ Cooldown   : ${cfg.countDown || 1}s
🏷 Aliases    : ${cfg.aliases?.join(", ") || "None"}
📂 Category   : ${cfg.category || "Uncategorized"}

📌 Usage:
${
        typeof cfg.guide?.en === "string"
          ? cfg.guide.en.replace(/\{pn\}/g, prefix + cfg.name)
          : prefix + cfg.name
      }

━━━━━━━━━━━━━━━━━━
`;

      return message.reply(msg);
    }

    // ===== ALL COMMAND LIST =====
    const categories = {};
    for (const [, cmd] of commands) {
      if (cmd.config.role > 1 && role < cmd.config.role) continue;
      const cat = cmd.config.category || "Uncategorized";
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(cmd.config.name);
    }

    const sortedCategories = Object.keys(categories).sort();

    let msg = `
╔════════════════════╗
         ☠️ HELP MENU ☠️
╚════════════════════╝

`;

    let total = 0;

    for (const cat of sortedCategories) {
      msg += `╭───〔 ${cat.toUpperCase()} 〕───⬣\n`;
      msg += `│ ${categories[cat].join("  •  ")}\n`;
      msg += `╰──────────────────⬣\n\n`;
      total += categories[cat].length;
    }

    msg += `
━━━━━━━━━━━━━━━━━━
📊 Total Commands : ${total}
⚡ Prefix         : ${prefix}
👑 Developer      : Rahat
💬 Type ${prefix}help <command>
━━━━━━━━━━━━━━━━━━
`;

    return message.reply(msg);
  }
};

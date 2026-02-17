const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => "https://azadxxx-cdp-api.onrender.com";

const config = {
  name: "cdp",
  aliases: ["coupledp"],
  version: "2.0",
  author: "Azad 💥",
  countDown: 5,
  role: 0,
  prefix: true,
  description: "Send a random couple DP directly from API",
  category: "image",
  usages: "coupledp",
  guide: "{pn}"
};

const onStart = async ({ event, api }) => {
  let loadingMsg;
  try {
    loadingMsg = await api.sendMessage({ body: `✨ 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗻𝗴 𝗬𝗼𝘂𝗿 𝗗𝗣...⏳` }, event.threadID);

    const response = await axios.get(`${await baseApiUrl()}/coupledp?random=${event.senderID}`);
    const data = response.data;
    console.log("API Response:", data);

    if (!data?.male || !data?.female) throw new Error("API response missing male/female data.");

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const malePath = path.join(cacheDir, `male_${Date.now()}.jpg`);
    const femalePath = path.join(cacheDir, `female_${Date.now()}.jpg`);

    const [maleImage, femaleImage] = await Promise.all([
      axios.get(data.male, { responseType: "arraybuffer" }),
      axios.get(data.female, { responseType: "arraybuffer" })
    ]);

    fs.writeFileSync(malePath, maleImage.data);
    fs.writeFileSync(femalePath, femaleImage.data);

    if (loadingMsg) await api.unsendMessage(loadingMsg.messageID);

    await api.sendMessage({
      body: `💫 Here's your random couple DP 💞`,
      attachment: [
        fs.createReadStream(malePath),
        fs.createReadStream(femalePath)
      ]
    }, event.threadID, event.messageID);

    fs.unlinkSync(malePath);
    fs.unlinkSync(femalePath);

  } catch (error) {
    console.error("Fetch DP Error:", error);
    if (loadingMsg) await api.unsendMessage(loadingMsg.messageID);
    api.sendMessage(`❌ Failed to fetch couple DP.\nCheck console for details.`, event.threadID, event.messageID);
  }
};

module.exports = {
  config,
  onStart,
  run: onStart
};

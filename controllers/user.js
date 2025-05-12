// controllers/user.js
const crypto = require("crypto");

function checkTelegramAuth(data, botToken) {
  const secret = crypto.createHash("sha256").update(botToken).digest();
  const { hash, ...rest } = data;
  const dataCheckString = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join("\n");

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(dataCheckString)
    .digest("hex");

  return hmac === hash;
}

module.exports.saveTelegramUser = async (req, res) => {
  const userData = req.query;
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

  if (!checkTelegramAuth(userData, BOT_TOKEN)) {
    return res.status(403).send("Unauthorized Telegram request");
  }

  console.log("Telegram user logged in:", userData);

  return res.redirect("https://t.me/sydney_event_2025_bot");
};

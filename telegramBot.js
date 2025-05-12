require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const Event = require("./models/event");
const connectDB = require("./db");

// Initialize Telegram Bot with polling enabled
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Welcome message and instructions
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome to Sydney Event Bot! 🎉\nPlease tell me what kind of events you like (e.g., music, art, tech)."
  );
});

// Handle user messages to find events
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text.toLowerCase().trim();

  // Skip /start message to avoid confusion
  if (text === "/start") return;

  try {
    // Fetch events from MongoDB that match the keyword (searching the title)
    const matchedEvents = await Event.find({
      title: { $regex: text, $options: "i" }, // Case-insensitive search for title
    });

    // If matching events are found, send them to the user
    if (matchedEvents.length > 0) {
      matchedEvents.forEach((event) => {
        bot.sendMessage(
          chatId,
          `🎫 *${event.title}*\n📅 ${event.date}\n🔗 [Get Tickets](${event.link})`,
          { parse_mode: "Markdown", disable_web_page_preview: false }
        );
      });
    } else {
      // If no events match, inform the user
      bot.sendMessage(
        chatId,
        "No matching events found. Try a keyword from event title!"
      );
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    bot.sendMessage(
      chatId,
      "An error occurred while fetching events. Please try again later."
    );
  }
});

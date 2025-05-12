const cron = require("node-cron");
const scrapeSydneyEvents = require("./scraper");
const Event = require("../models/event");

// Schedule task to run every 1 hour
cron.schedule("0 * * * *", async () => {
  console.log("Running scheduled event scrape...");

  try {
    const events = await scrapeSydneyEvents();
    await Event.deleteMany({});
    await Event.insertMany(events);
    console.log(`Updated ${events.length} events.`);
  } catch (err) {
    console.error("Error scraping events:", err);
  }
});

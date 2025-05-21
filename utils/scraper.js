const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeSydneyEvents() {
  const url = "https://www.eventbrite.com.au/d/australia--sydney/events/";

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const events = [];

    $("div.small-card-mobile.eds-l-pad-all-2").each((i, card) => {
      const link = $(card).find("a").attr("href");
      const title = $(card).find("div.Stack_root__1ksk7 a h3").text().trim();
      const date = $(card).find("div.Stack_root__1ksk7 p").text().trim();

      if (title && date && link) {
        events.push({ title, date, link });
      }
    });

    console.log("Events scraped:", events[0] || "None found");
    return events;
  } catch (error) {
    console.error("Error scraping with Cheerio:", error);
    return [];
  }
}

// scrapeSydneyEvents();

module.exports = scrapeSydneyEvents;

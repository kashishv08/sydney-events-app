const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeSydneyEvents() {
  const url = "https://www.eventbrite.com.au/d/australia--sydney/events/";

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      },
      timeout: 10000, // 10 seconds timeout
    });

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
    console.error("Error scraping with Cheerio:", error.message || error);
    return [];
  }
}

module.exports = scrapeSydneyEvents;

const puppeteer = require("puppeteer-core");

async function scrapeSydneyEvents() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  console.log("Navigating to the events page...");
  await page.goto("https://www.eventbrite.com.au/d/australia--sydney/events/", {
    waitUntil: "domcontentloaded",
  });

  console.log("Waiting for event cards...");
  await page.waitForSelector("div.small-card-mobile.eds-l-pad-all-2", {
    timeout: 10000,
  });

  console.log("Page loaded. Scraping events...");
  const events = await page.evaluate(() => {
    const eventList = [];
    const cards = document.querySelectorAll(
      "div.small-card-mobile.eds-l-pad-all-2"
    );

    cards.forEach((card) => {
      const linkTag = card.querySelector("a");
      const link = linkTag?.href;

      const title = card
        .querySelector("div.Stack_root__1ksk7 a h3")
        ?.innerText?.trim();
      const date = card
        .querySelector("div.Stack_root__1ksk7 p")
        ?.innerText?.trim();

      if (title && date && link) {
        eventList.push({ title, date, link });
      }
    });

    return eventList;
  });

  await browser.close();

  if (events.length === 0) {
    console.log("No events found");
  } else {
    console.log("Events scraped:", events[0]);
  }

  return events;
}

scrapeSydneyEvents()
  .then((events) => {
    console.log("Final scraped events:", events[0]);
  })
  .catch((err) => {
    console.error("Error in scraping:", err);
  });

module.exports = scrapeSydneyEvents;

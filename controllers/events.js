const Event = require("../models/event");
const scrapeSydneyEvents = require("../utils/scraper");
const Email = require("../models/email");

module.exports.fetchAndDisplayEvents = async (req, res) => {
  try {
    const events = await scrapeSydneyEvents();

    // Save to database
    await Event.deleteMany({});
    await Event.insertMany(events);

    res.render("index", { events });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).send("Error fetching events");
  }
};
module.exports.getTicket = (req, res) => {
  const { link } = req.query;
  if (!link) return res.status(400).send("Event link missing.");
  res.render("email-form", { link });
};

module.exports.redirect = async (req, res) => {
  const { email, link } = req.body;

  if (!email || !link) return res.status(400).send("Missing email or link");

  await Email.create({ email });
  console.log(" User email:", email);

  res.redirect(link);
};

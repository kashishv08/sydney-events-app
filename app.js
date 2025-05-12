const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const eventRoutes = require("./routes/events");
const userRoutes = require("./routes/user");
const connectDB = require("./db.js");

connectDB();

require("./utils/autoScrape");
require("./telegramBot");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.use("/", eventRoutes);
app.use("/", userRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

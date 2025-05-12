const express = require("express");
const router = express.Router();
const { saveTelegramUser } = require("../controllers/user");

router.get("/save-telegram-user", saveTelegramUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const eventCntrl = require("../controllers/events");

router.get("/", eventCntrl.fetchAndDisplayEvents);
router.get("/get-tickets", eventCntrl.getTicket);
router.post("/redirect", eventCntrl.redirect);

module.exports = router;

const express = require("express");
const router = express.Router();

const dashLinhasController = require("../controllers/dashLinhasController");

router.get("/dashboard", dashLinhasController.readS3Json);

module.exports = router;
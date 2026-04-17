const express = require("express");
const router = express.Router();

const dashLinhasController = require("../controllers/dashLinhasController");

router.get("/dashboard", dashLinhasController.dashLinhas);

module.exports = router;
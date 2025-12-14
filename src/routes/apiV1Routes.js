const express = require("express");
const router = express.Router();

const priceRoutes = require("./priceRoutes");

router.use("/prices", priceRoutes);

module.exports = router;
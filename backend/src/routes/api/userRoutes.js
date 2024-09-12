const express = require("express");
const router = express.Router();
const testController = require("../../controllers/userController");

// Example route
router.get("/", testController);

module.exports = router;

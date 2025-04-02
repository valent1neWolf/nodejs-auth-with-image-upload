const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const { changePassword } = require("../controllers/auth-controller");

const router = express.Router();

router.post("/change-password", authMiddleware, changePassword);

module.exports = router;

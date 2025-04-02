const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
router.get("/welcome", authMiddleware, (req, res) => {
  const { userName, userId, role } = req.userInfo;
  res.json({
    message: "Welcome to the home page.",
    user: {
      _id: userId,
      userName,
      role,
    },
  });
});

module.exports = router;

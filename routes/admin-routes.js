const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
router.get("/welcome", authMiddleware, adminMiddleware, (req, res) => {
  const { userName, userId, role } = req.userInfo;
  res.json({
    message: "Welcome to the admin page.",
    user: {
      _id: userId,
      userName,
      role,
    },
  });
});

module.exports = router;

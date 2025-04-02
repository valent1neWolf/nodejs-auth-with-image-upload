require("dotenv").config();
const { connect } = require("mongoose");
const { connectDB } = require("./database/database");
const express = require("express");
const authRoutes = require("./routes/auth-routes");
const homeRoutes = require("./routes/home-routes");
const adminRoutes = require("./routes/admin-routes");
const uploadImageRoutes = require("./routes/image-routes");
const settingsRoutes = require("./routes/settings-route");
const app = express();

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", uploadImageRoutes);
app.use("/api/settings", settingsRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

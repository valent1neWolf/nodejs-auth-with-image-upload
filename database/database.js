require("dotenv").config();
const mongoose = require("mongoose");

const db_name = mongoose.connection.useDb(process.env.DB_NAME);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, getDbName: () => db_name };

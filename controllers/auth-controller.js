require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//register
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    }); //ha már létezik User ezzel a névvel vagy emaillel
    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message:
          "User already eaxists with same username or email. Please try an other one.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role,
    });

    await user.save();
    res.status(201).send({
      status: true,
      data: user,
      message: "User created succesfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign(
        {
          userId: user._id,
          userName: user.username,
          role: user.role,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "15m",
        }
      );
      res.status(200).json({
        success: true,
        message: "Login succesfull.",
        accessToken,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured during login" + error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    console.log(req.userInfo);
    const { oldPassword, newPassword } = req.body;
    const userId = req.userInfo.userId;
    const user = await User.findById(userId);

    if (await bcrypt.compare(oldPassword, user.password)) {
      const salt = await bcrypt.genSalt(10);
      const updatedpassword = await bcrypt.hash(newPassword, salt);
      user.password = updatedpassword; // Update the password
      const updatedUser = await user.save(); // Save the updated user
      console.log(req.userInfo);
      res.status(200).json({
        success: true,
        message: "Password changed succesfully.",
        data: updatedUser,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occured while changing the password." + error.message,
    });
  }
};
module.exports = { register, login, changePassword };

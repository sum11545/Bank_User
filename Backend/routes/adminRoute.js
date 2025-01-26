const express = require("express");
const route = express.Router();
const bankModel = require("../models/bankModel");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Admin Login
route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ status: false, message: "User not found" });
    }

    if (user.is_admin == 0) {
      return res.json({ status: false, message: "You are not an admin" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      "MYNAMEISSUMIT",
      { expiresIn: "5h" }
    );

    res.cookie("cookie", token);
    res.json({ status: true, message: "You are logged in", token });
  } catch (error) {
    return res.json({
      status: false,
      message: "Invalid Credentials",
      error: error,
    });
  }
});

// Logout Admin
route.post("/logout", (req, res) => {
  res.clearCookie("cookie"); // Clear the cookie
  res.json({ status: true, message: "Logged out successfully" });
});

// Fetch all bank data
route.get("/", async (req, res) => {
  try {
    const bankData = await bankModel.find({});
    res.json(bankData);
  } catch (error) {
    return res.json({
      status: false,
      message: "Internal server error ",
    });
  }
});

// Search and Filter
route.get("/search", async (req, res) => {
  try {
    const { branchName, bankName, accountName, accountNumber } = req.query;

    // Build dynamic query
    const query = {};
    if (branchName) query.branchName = { $regex: branchName, $options: "i" };
    if (bankName) query.bankName = { $regex: bankName, $options: "i" };
    if (accountName) query.accountName = { $regex: accountName, $options: "i" };
    if (accountNumber) query.accountNumber = accountNumber; // Exact match for numbers

    // Fetch data from the database
    const bankData = await bankModel.find(query);
    console.log("Constructed Query:", query); // Log the constructed query
    console.log("Fetched Bank Data:", bankData); // Log the fetched bank data

    res.json({ status: true, data: bankData });
  } catch (error) {
    console.error(error);
    return res.json({
      status: false,
      message: "Internal server error",
    });
  }
});

module.exports = route;

const express = require("express");
const route = express.Router();
const userModel = require("../models/userModel");
const bankModel = require("../models/bankModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const {
  registerValidator,
  loginValidator,
  bankValidator,
} = require("../config/vaildations");
const cookieparser = require("cookie-parser");
route.use(cookieparser());
route.get("/", (req, res) => {
  res.send("Hello World form route ");
});

//isAuth
function isAuth() {
  return async (req, res, next) => {
    try {
      // const token = req.cookies.Cookie;
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: "Access Denied. Please log in." });
      }
      const decode = jwt.verify(token, "MyNAMEISSUMITRAI");
      console.log("Decoded token:", decode);

      req.user = decode;
      next();
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Invalid or expired token. Please log in." });
    }
  };
}

//register
route.post("/register", registerValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    console.log(req.body.email);

    const checkUser = await userModel.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (checkUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("HashedPassword ", hashedPassword);

    const userData = await new userModel({
      username: username,
      email: email,
      password: hashedPassword,
    });

    const data = await userData.save();

    return res.status(200).json({
      message: "User Creted Succefully ",
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      message: "internal server error ",
    });
  }
});

//login

route.post("/login", loginValidator, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
      });
    }

    const { username, email, password } = req.body;

    const loginDetails = await userModel.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (!loginDetails) {
      return res.status(400).json({ error: "User Not Exist" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      loginDetails.password
    );

    if (!isValidPassword) {
      return res.status(400).json({ error: "Invalid Password" });
    }
    const token = jwt.sign(
      { email, id: loginDetails._id },
      "MyNAMEISSUMITRAI",
      {
        expiresIn: "2h",
      }
    );

    res.cookie("Cookie", token);
    return res.status(200).json({
      message: "Login Successful ",
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      message: "internal server error ",
    });
  }
});

route.get("/home", isAuth(), (req, res) => {
  res.json({ message: "Hello World", user: req.user });
});

//bank Route

route.post("/add", isAuth(), async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const userid = req.user.id;
    console.log(userid);

    const { accountNumber, accountName, bankName, branchName, ifsc } = req.body;

    const bankData = new bankModel({
      user: userid,
      accountNumber,
      accountName,
      bankName,
      branchName,
      ifsc,
    });
    const result = await bankData.save();
    res.json({
      message: "Bank Added Successfully",
      result: result,
    });
  } catch (error) {
    res.status(400).json({
      message: "Internal Server Error",
      Error: error,
    });
  }
});

//edit bank accoutn

route.get("/accounts", isAuth(), async (req, res) => {
  try {
    const userid = req.user.id;
    console.log(userid);
    const data = await bankModel.find({ user: userid });
    res.json(data);
  } catch (error) {
    return res.json({
      message: "Internal Server Error",
      error: error,
    });
  }
});

route.put("/edit/:id", isAuth(), bankValidator, async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const userid = req.user.id;
    console.log("User ID", userid);
    const bankid = req.params.id;

    const bankDet = await bankModel.findOne({ user: userid });
    console.log(bankDet, "Hello");
    if (!bankDet) {
      return res.status(400).json({ message: "Bank Account Not Found" });
    }

    const { accountNumber, accountName, bankName, branchName, ifsc } = req.body;

    const updatebank = await bankModel.findOneAndUpdate(
      {
        _id: bankid,
        user: userid,
      },
      {
        $set: {
          accountNumber: accountNumber,
          accountName: accountName,
          bankName: bankName,
          branchName: branchName,
          ifsc: ifsc,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatebank) {
      return res.status(404).json({ message: "Bank Not Found yes buddy" });
    }

    return res.json({
      message: "Bank Updated Successfully",
      result: updatebank,
    });
  } catch (error) {
    return res.json({
      message: "Internal Server Error",
    });
  }
});

route.delete("/delete/:id", isAuth(), async (req, res) => {
  try {
    const userid = req.user.id;
    const bankid = req.params.id;
    const bankDet = await bankModel.findOne({ user: userid });
    if (!bankDet) {
      return res.status(400).json({ message: "Bank Account Not Found" });
    }

    const deletebank = await bankModel.findByIdAndDelete(bankid);
    if (deletebank) {
      return res.json({ message: "Bank Deleted Successfully" });
    }
  } catch (error) {
    return res.json({
      message: "Internal Server Error",
    });
  }
});

route.post("/logout", (req, res) => {
  try {
    res.clearCookie("Cookie");

    return res.status(200).json({
      message: "Logged Out Successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = route;

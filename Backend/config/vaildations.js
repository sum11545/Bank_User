const { check } = require("express-validator");
const userModel = require("../models/userModel");

exports.registerValidator = [
  check("username", "username is required").not(),
  check("email", "Email is required").isEmail().normalizeEmail({
    allDomains: true,
  }),
  check(
    "password",
    "Password is required Minimum password length is 6 and it should contain at least one uppercase letter, one lowercase letter, and one number"
  ).isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  }),
];

exports.loginValidator = [
  check("username", "username is required").not(),
  check("email", "Email is required").isEmail().normalizeEmail({
    allDomains: true,
  }),
  check("password", "Password is required").not().isEmpty(),
];

exports.bankValidator = [
  // Account Number Validation
  check("accountNumber", "Account number should be 10 or 12 digits")
    .not()
    .isEmpty()
    .withMessage("Account number is required")
    .isNumeric()
    .withMessage("Account number must contain only numbers")
    .isLength({ min: 10, max: 12 })
    .withMessage("Account number must be 10 or 12 digits long"),

  // Account Name Validation
  check("accountName", "Account name should only contain alphabets")
    .not()
    .isEmpty()
    .withMessage("Account name is required")
    .isAlpha("en-US", { ignore: " " }) // Allows spaces in account names
    .withMessage("Account name must contain only alphabets"),

  // Bank Name Validation
  check("bankName", "Bank name should only contain alphabets")
    .not()
    .isEmpty()
    .withMessage("Bank name is required")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Bank name must contain only alphabets"),

  // Branch Name Validation
  check("branchName", "Branch name should only contain alphabets")
    .not()
    .isEmpty()
    .withMessage("Branch name is required")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Branch name must contain only alphabets"),

  // IFSC Code Validation
  check("ifsc", "IFSC code must be alphanumeric and 11 characters long")
    .not()
    .isEmpty()
    .withMessage("IFSC code is required")
    .isLength({ min: 11, max: 11 })
    .withMessage("IFSC code must be exactly 11 characters long")
    .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/),
];

const mongoose = require("mongoose");

const bankSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  accountNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  branchName: {
    type: String,
    required: true,
  },
  ifsc: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Bank", bankSchema);

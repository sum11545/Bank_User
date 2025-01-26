const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  is_admin: {
    type: Number,
    default: 0, // 0 is false and 1 true
  },
});

module.exports = mongoose.model("User", userSchema);

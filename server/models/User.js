const mongoose = require("mongoose");

// user form data excel

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  role: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);

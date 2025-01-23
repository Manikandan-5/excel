const mongoose = require("mongoose");


// user credential 

const credentialSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("Credential", credentialSchema);

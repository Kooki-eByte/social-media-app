const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: false,
    required: false,
  },
  password: {
    type: String,
    unique: false,
    required: false,
  },
  email: {
    type: String,
    unique: false,
    required: false,
  },
  createdAt: String,
});

module.exports = model("User", userSchema);

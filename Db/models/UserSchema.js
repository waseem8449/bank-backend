const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
  },
  accountNo: {
    type: Number,
  },
  amount: {
    type: Number,
  },
});
UserSchema.methods = {
  authenticate: async function (password) {
    return await bcrypt.compareSync(password, this.password);
  },
};
module.exports = mongoose.model("User", UserSchema);

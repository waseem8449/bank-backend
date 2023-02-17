const mongoose = require("mongoose");
const Transactionschema = new mongoose.Schema(
  {
    senderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverID:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    senderBalance: {
      type: Number,
    },
    receiver:{
      type:String,
    },
    withdrawal: {
      type: Number,
    },
    deposit: {
      type: Number,
    },
    amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", Transactionschema);

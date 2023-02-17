const express = require("express");
const router = express.Router();
const User = require("../Db/models/UserSchema");
const Transaction = require("../Db/models/Transactionschema");
const jwt = require("jsonwebtoken");
const { authMethod, authBanker } = require("../common-middleware");
const UserSchema = require("../Db/models/UserSchema");

router.post("/register", async (req, res) => {
  const { name, email, password, userType } = req.body;
  let data;
  if (!name || !email || !password || !userType) {
    res.status(404).json("plwease fill data");
  }
  try {
    const preuser = await User.findOne({ email: email });
    if (preuser) {
      res.status(404).json("this uer is already present");
    } else {
      if (userType == "Candidate") {
        let accountNo = Math.floor(10000000 + Math.random() * 90000000);
        data = { name, email, password, userType, accountNo, amount: 00 };
      } else {
        data = { name, email, password, userType };
      }
      const adduser = new User(data);
      await adduser.save();
      res.status(201).json(adduser);
      console.log(adduser);
    }
  } catch (error) {
    res.status(404).json(error);
  }
});
//delete

router.delete("/deleteuser/:_id", authMethod, async (req, res) => {
  try {
    let data = await User.deleteOne({ _id: req.params });
    console.log(data);
    res.status(201).json(data);
  } catch (error) {
    res.status(404).json(error);
  }
});
//listing

router.get("/getCandidateList", authBanker, async (req, res) => {
  try {
    const { userType } = req.user;
    if (userType == "Banker") {
      let data = await User.find({ userType: "Candidate" });
      res.status(201).json(data);
      // console.log(data);
    }
  } catch (error) {
    res.status(404).json(error);
  }
});
router.post("/Login", (req, res) => {
  const { email, password } = req.body;
  try {
    User.findOne({ email: email }, (err, user) => {
      if (user) {
        if (user.authenticate(password)) {
          const token = jwt.sign({ _id: user._id }, "waseem", {
            expiresIn: "1d",
          });
          res.status(200).json({
            token: token,
            user: user,
          });
        }
      } else {
        return res.status(400).json({ message: "Something went wrong" });
      }
    });
  } catch (error) {
    return error;
  }
});
router.post("/transaction", authMethod, async (req, res) => {
  // console.log("eq.body");
  console.log(' req.body',  req.body)
  let { Account, Amount } = req.body;
  let { name, _id, sender, amount } = req.user;
  console.log(Account, "------req.user", req.user);
  try {
    const acc = await UserSchema.findOne({ accountNo: Account });
    console.log(amount, "Amount", Amount);
    if (Amount <= amount) {
      let amo = amount - Amount;
      console.log("acc.amount", acc);
      let receive = acc.amount + Amount;
      console.log(amo, "Amount", receive);

      await UserSchema.findByIdAndUpdate({ _id }, { amount: amo });
      await UserSchema.findByIdAndUpdate({ _id: acc._id }, { amount: receive });

      const tr = new Transaction({
        accountNo: Account,
        name,
        sender,
        senderID: _id,
        receiverID: acc._id,
        receiver: acc.receiver,
        amount: Amount,
        senderBalance:amo
      });
      let data = await tr.save();
      res.status(201).json(data);
    } else {
      res.status(404).json("balance is low");
    }
  } catch (err) {
    res.status(201).json(err);
    console.log(err);
  }
});

router.get("/showTransactions", authMethod, async (req, res) => {
  try {
    let data = await Transaction.find().populate("senderID");
    res.status(201).json(data);
    console.log(data);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.get("/showUser/:_id", authMethod, async (req, res) => {
  try {
    console.log("req.pram", req.params);
    let data = await Transaction.find({ senderID: req.params })
      .select()
      .populate("senderID receiverID");

    console.log("jhgfxcd", data);
    res.status(201).json(data);
  } catch (error) {
    res.status(404).json(error);
  }
});
router.get("/deleteUser/:_id", authMethod, async (req, res) => {
  try {
    let data = await UserSchema.deleteOne({ _id: req.params });
    console.log(data);
    res.status(201).json(data);
  } catch (error) {
    res.status(404).json(error);
  }
});
router.get("/history", authMethod, async (req, res) => {
  let { _id } = req.user;

  try {
    let data = await Transaction.find({
      $or: [{ receiverID: _id }, { senderID: _id }],
    })
      .select()
      .populate("senderID receiverID");
    res.status(201).json(data);
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;

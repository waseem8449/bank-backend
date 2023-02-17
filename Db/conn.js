const mongoose = require("mongoose");
const db = "mongodb+srv://waseem8449:waseem@cluster0.1rdpngo.mongodb.net/Banking";
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection start"))
  .catch((error) => console.log(error.message));

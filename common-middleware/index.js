const jwt = require("jsonwebtoken");
const UserSchema = require("../Db/models/UserSchema");

async function authMethod(req, res, next) {
  let token = req.headers["authorization"];
  if (!token) {
    const err = new Error("Auth token missing.");
    err.status = 401;
    return next(err);
  }

  token = token.split(" ")[1];

  const decoded = jwt.decode(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }

  let user;
  try {
    user = await UserSchema.findById(decoded._id)

      .lean()
      .exec();
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

  } catch (err) {
    return next(err);
  }

  req.user = user;
  next();
}
async function authBanker(req, res, next) {
  let token = req.headers["authorization"];
  if (!token) {
    const err = new Error("Auth token missing.");
    err.status = 401;
    return next(err);
  }

  token = token.split(" ")[1];

  const decoded = jwt.decode(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }

  let user;
  try {
    user = await UserSchema.findById(decoded._id)

      .lean()
      .exec();
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

  } catch (err) {
    return next(err);
  }

  req.user = user;
  next();
}
module.exports = { authMethod,authBanker };

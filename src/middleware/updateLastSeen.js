const UserModel = require("../models/User");

module.exports = (res, req, next) => {
  UserModel.findOneAndUpdate({
      _id: "5ed99ba9c9cd73285c8ec990",
    }, {
      last_seen: new Date(),
    }, {
      new: true,
    },
    () => {}
  );
  next();
}
import User from "../models/User.ts";

export default (req, res, next) => {
  const userId = req.header("id");
  
  if (userId && userId !== 'null' && userId !== 'undefined') {
    try {
      User.findOne({
        _id: userId,
      }).then((user: any) => {
        user.isOnline = true;
        user.last_seen = new Date();
        user.save();

        setTimeout(() => {
          user.isOnline = Date.now() - user.last_seen < 55000;
          user.save();
        }, 50000);
      });
    } catch (err) {
      res.send({responseCode: "Something wrong with onlineChanger"});
    }
  } 
  next();
};

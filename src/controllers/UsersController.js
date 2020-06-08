const UserSchema = require('../schemes/User');

let UsersController = {
  findUser: (req, res) => {
    UserSchema.findOne({
      _id: req.params.id
    }, (err, user) => {
      if (err) return console.log(err);
      res.send(user);
    });
  },

  createUser: (req, res) => {
    const User = new UserSchema({
      email: req.body.email,
      fullName: req.body.fullName,
      password: req.body.password,
      avatar: req.body.avatar || 'none'
    })
    User.save((err, result) => {
      console.log('created user');
      res.send(User);
    })
  },

  updateUser: (req, res) => {
    const updateUser = {
      avatar: req.body.avatar,
      fullName: req.body.fullName,
      password: req.body.password
    }
    UserSchema.findOneAndUpdate({
        _id: req.params.id
      },
      updateUser, {
        new: true,
        useFindAndModify: false
      },
      (err, user) => {
        if (err) return console.log(err);
        res.send(user);
      });
  },

  deleteUser: (req, res) => {
    UserSchema.deleteOne({
      _id: req.params.id
    }, function (err, user) {
      if (err) return console.log(err);
      res.send(user);
    });
  }
}

module.exports = UsersController;
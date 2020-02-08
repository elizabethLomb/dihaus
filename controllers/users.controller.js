const User = require('../models/user.model');
const createError = require('http-errors');

//registro de usuario
module.exports.register = (req, res, next) => {
  const {userType, name, lastname, birthday, email, password, bio } = req.body
  const file = req.file;
  const user = new User({
      userType: userType,
      name: name,
      lastname: lastname,
      birthday: birthday,
      email: email,
      password: password,
      avatar: file ? req.file.url : null,
      bio: bio
    })
  
    user.save()
      .then(user => res.status(201).json(user))
      .catch(next)
}

//perfil del usuario
module.exports.profile = (req, res, next) => {
  User.findOne({ username: req.params.username })
  .populate({
    path: 'properties',
    populate: {
      path: 'user'
    }
  })

  .then(user => {
    if (user) {
      //res.render('users/profile', { user, properties: user.properties })
      res.json(user)
    } else {
      req.session.genericError = 'user not found'
      res.redirect('/')
    }
  })
  .catch(next)
}

//login
module.exports.doLogin = (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw createError(400, 'missing credentials');
  }

  User.findOne({ email: email })
    .then(user => {
      if(!user) {
        throw createError(404, 'user not found');
      } else {
        return user.checkPassword(password)
        .then(match => {
          if (!match) {
            throw createError(400, 'invalid password');
          } else {
            req.session.user = user;
            res.json(user)
          }
        }).catch(next)
      }
    }).catch(next)
}

//logout
module.exports.logout = (req, res) => {
  req.session.destroy();
  res.status(204).json();
}
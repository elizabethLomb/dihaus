const createError = require('http-errors');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');

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
  User.findOne({ id: req.params.id })
  .populate({
    path: 'properties',
    populate: {
      path: 'user'
    },
    path: 'comments',
      options: {
        sort: {
          createdAt: -1
        }
      }
  })

  .then(user => {
    if (user) {
      console.log('user----->', user)
      res.json(user)
    } else {
      req.session.genericError = 'user not found'
      res.redirect('/')
    }
  })
  .catch(next)
}

module.exports.addComment = (req, res, next) => {
  const comment = new Comment({
    text: req.body.text,
    fromUser: req.currentUser.id,
    toUser: req.params.id
  })

  comment.save()
  .then(comment => {
    console.log('Comment ----->', comment)
    res.json(comment)
  }).catch(next)
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
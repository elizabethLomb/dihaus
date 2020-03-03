const createError = require('http-errors');
const User = require('../models/user.model');
const Comment = require('../models/comment.model');
const Property = require('../models/property.model');

//post new user
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

//get user profile
module.exports.profile = (req, res, next) => {
  User.findById(req.params.id)
  .populate('properties')
  .populate({
    path: 'comments',
    options: {
      sort: {
        createdAt: -1
      }
    },
    populate: {
      path: 'fromUser',
      populate: {
        path: 'properties'
      }
    }
  })

  .then(user => {
    if (user) {
      res.json(user)
    } else {
      req.session.genericError = 'user not found'
      res.redirect('/')
    }
  })
  .catch(next)
}

//post- add comment toUser - fromUser
module.exports.addComment = (req, res, next) => {
  const comment = new Comment({
    text: req.body.text,
    fromUser: req.currentUser.id,
    toUser: req.params.id
  })

  comment.save()
  .then(comment => {
    res.json(comment)
  }).catch(next)
}

//get property listings contacts history
module.exports.inbox = (req, res, next) => {
  User.findById(req.params.id)
  .populate('contact')

  .then(contacts => {
    res.json(contacts)
  }).catch(next)
}

//get hauser properties and bookings & user bookings
module.exports.bookingList = (req, res, next) => {
  User.findById(req.params.id)
  .populate({
    path: 'properties',
    populate: {
      path: 'bookings',
      populate: {
        path: 'fromUser'
      }
    }
  })
  .then(bookings => {
    res.json(bookings)
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
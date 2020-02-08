const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_WORK_FACTOR = 10;

const userType = require('../constants/userType');

const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: userType,
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Requerido'],
    minlength: [3, 'Min 3 carácteres'],
    trim: true
  },
  lastname: {
    type: String,
    required: [true, 'Requerido'],
    minlength: [3, 'Min 3 carácteres'],
    trim: true
  },
  // birthday: {
  //   type: Date
  // },
  email: {
    type: String,
    required: [true, 'Requerido'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [EMAIL_PATTERN, 'Email no válido']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password needs at last 8 chars']
  },
  avatar: {
    type: String,
  },
  bio: {
    type: String
  },
  validated: {
    type: Boolean,
    default: true
  },
  social: {
    google: String,
    facebook: String,
    slack: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
})

userSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(SALT_WORK_FACTOR)
      .then(salt => {
        return bcrypt.hash(user.password, salt)
          .then(hash => {
            user.password = hash;
            next();
          });
      })
      .catch(error => next(error));
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
}

userSchema.virtual('properties', {
  ref: 'Property',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

const User = mongoose.model('User', userSchema);
module.exports = User;

/*
{
  "userType": "Particular",
  "name": "eli",
  "lastname": "lombs",
  "email": "hola@hola.com",
  "password": "123456789",
  "avatar": "",
  "bio": "aaaaaaa"
}

{
  "email": "hola@hola.com",
  "password": "123456789"
}
*/
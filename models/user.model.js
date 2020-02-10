const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_WORK_FACTOR = 10;

const userType = require('../constants/userType');
const genders = require('../constants/genders');

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
  ProfessionalArea: {
    type: String
  },
  Gender: {
    type: String,
    enum: genders
  },
  birthday: {
    type: Date
  },
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
  "userType": "Agencia",
  "name": "amiga",
  "lastname": "lombs",
  "email": "amiga@hola.com",
  "password": "123456789",
  "avatar": "",
  "ProfessionalArea": "Developer",
  "Gender": "Mujer",
  "birthday": "1985-01-23",
  "bio": "aaaaaaa"
}

{
  "validated": true,
  "userType": "Agencia",
  "name": "amiga",
  "lastname": "lombs",
  "birthday": "1985-01-23T00:00:00.000Z",
  "email": "amiga@hola.com",
  "avatar": null,
  "bio": "aaaaaaa",
  "createdAt": "2020-02-10T15:31:54.632Z",
  "updatedAt": "2020-02-10T15:31:54.632Z",
  "id": "5e41776a6f8cfd5f47ff570b"
}

{
  "email": "hola@hola.com",
  "password": "123456789"
}
*/
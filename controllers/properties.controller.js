const Property = require('../models/property.model');
const User = require('../models/user.model');

module.exports.index = (req, res, next) => {
  Property.find()
  .then().catch()
}
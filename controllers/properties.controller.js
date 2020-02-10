const Property = require('../models/property.model');
const User = require('../models/user.model');

module.exports.create = (req, res, next) => {
  const {propertyType, title, price, location, address, type, description, size, facade, comforts, state, rooms, floor, door, bathrooms, rules, conditions, availability, minPermanence, maxPermanence, energeticCertification } = req.body
  const images = req.images;
  
  const property = new Property({
    user: req.currentUser.id,
    propertyType: propertyType,
    title: title,
    price: price,
    location: location,
    address: address,
    type: type,
    description: description,
    size: size,
    facade: facade,
    comforts: comforts,
    state: state,
    rooms: rooms,
    floor: floor,
    door: door,
    bathrooms: bathrooms,
    rules: rules,
    images: images ? req.image.url : null,
    conditions: conditions,
    availability: availability,
    minPermanence: minPermanence,
    maxPermanence: maxPermanence,
    energeticCertification: energeticCertification
  })
  property.save()

  .then(property => {
    res.status(201).json(property)
  }).catch(next)
}
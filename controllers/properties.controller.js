const Property = require('../models/property.model');
const User = require('../models/user.model');

//crear una nueva propiedad
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
    console.log('property----->', property)
    res.status(201).json(property)
  }).catch(next)
}

//list of homes by city
module.exports.list = (req, res, next) => {
  const params = req.params.location
  const location = { address: { $eq: params }}

  Property.find(location)
  .sort({ createdAt: -1 })

  .then(properties => {
    console.log('params-->', params)
    console.log('location-->', location)
    console.log('properties-->', properties)
    res.json(properties)
  }).catch(next)
}
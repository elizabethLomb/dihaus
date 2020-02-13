const Property = require('../models/property.model');
const Booking = require('../models/booking.model');
const Contact = require('../models/contact.model');

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
    res.json(properties)
  }).catch(next)
}

//get detail of property
module.exports.detail = (req, res, next) => {
  Property.findById(req.params.id)
  .populate('user')
  // .populate({
  //   path: 'comments',
  //   options: {
  //     sort: {
  //       createdAt: -1
  //     }
  //   },
  //   populate: {
  //     path: 'user'
  //   }
  // })
  .then(property => {
    res.json(property)
  }).catch(next)
}

//resrva visita property, display rules and form
module.exports.booking = (req, res, next) =>{
  const booking = new Booking({...req.body, property: req.params.id})
  booking.save()

  .then(booking => {
    console.log(booking)
    res.json(booking)
  }).catch(next)
}

module.exports.contact = (req, res, next) => {
  const propertyId = req.params.id
  const contact = new Contact({
    text: req.body.text,
    user: req.currentUser.id,
    property: propertyId
  })
  contact.save()
  
  .then(contact => {
    console.log('Contact--->', contact)
    res.json(contact)
  }).catch(next)
}



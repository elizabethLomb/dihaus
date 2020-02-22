const Property = require('../models/property.model');
const Booking = require('../models/booking.model');
const Contact = require('../models/contact.model');
const User = require('../models/user.model');

//post new property
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
    if(currentUser.userType === 'Particular'){
      User.findByIdAndUpdate(req.params.id, { userType: 'Hauser' }, { new: true })
      .then(user => {
        req.session.user = user 
        res.status(201).json(property)
      })
    } else {
      res.status(201).json(property)
    }
  }).catch(next)
}

//get list of homes by city
module.exports.list = (req, res, next) => {
  const params = req.params.location
  const location = { city: { $eq: params }}

  Property.find(location)
  .populate('user')
  .sort({ createdAt: -1 })

  .then(properties => {
    res.json(properties)
  }).catch(next)
}

//get detail of property 
module.exports.detail = (req, res, next) => {
  Property.findById(req.params.id)
  .populate('user')
  .populate({
    path: 'comments',
    options: {
      sort: {
        createdAt: -1
      }
    },
    populate: {
      path: 'user'
    },
    path: 'bookings',
    options: {
      sort: {
        createdAt: -1
      }
    }
  })
  .then(property => {
    res.json(property)
  }).catch(next)
}

//post resrva visita property, display rules and form
module.exports.booking = (req, res, next) =>{
  //const booking = new Booking({...req.body, property: req.params.id})
  const booking = new Booking({
    fromUser: req.currentUser.id,
    property: req.params.id,
    ...req.body
  })
  booking.save()

  .then(booking => {
    res.json(booking)
  }).catch(next)
}

//contact hauser - no reservation post
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



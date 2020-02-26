require('../config/db.config');

const faker = require('faker')

//models
const Booking = require('../models/booking.model');
const Comment = require('../models/comment.model');
const Contact = require('../models/contact.model');
const Payment = require('../models/payment.model');
const Property = require('../models/property.model');
const User = require('../models/user.model');

//constants
const userTypes = require('../constants/userType');
const genders = require('../constants/genders');
const propertyTypes = require('../constants/propertyType');
const types = require('../constants/types');
const facades = require('../constants/facades');
const comforts = require('../constants/comforts');
const states = require('../constants/states');
const floors = require('../constants/floors');
const doors = require('../constants/doors');
const rules = require('../constants/rules');
const cities = require('../constants/spainCities');

const userIds = []

Promise.all([
  Booking.deleteMany(),
  Comment.deleteMany(),
  Contact.deleteMany(),
  Payment.deleteMany(),
  Property.deleteMany(),
  User.deleteMany()
])

  .then(() => {
    for (let i = 0; i < 10; i++) {
      const user = new User({
        userType: userTypes[Math.floor(Math.random() * userTypes.length)],
        name: faker.name.findName(),
        lastname: faker.name.lastName(),
        ProfessionalArea: faker.name.jobArea(),
        Gender: genders[Math.floor(Math.random() * genders.length)],
        birthday: faker.date.past(),
        email: faker.internet.email(),
        password: 123456789,
        avatar: faker.internet.avatar(),
        bio: faker.lorem.paragraphs(),
        validated: true
      })
      user.save()
      
      .then(user => {
        userIds.push(user.id)

        for (let j = 0; j < 10; j++) {
          const property = new Property({
            user: user.id,
            propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
            title: faker.lorem.words(),
            price: faker.commerce.price(),
            location: {
              type: {
                coordinates: [
                  faker.address.longitude(),
                  faker.address.latitude()
                ]
              }
            },
            city: cities[Math.floor(Math.random() * types.length)],
            type: types[Math.floor(Math.random() * types.length)],
            description: faker.lorem.paragraphs(),
            size: Math.floor(Math.random() * (1000 - 10) + 10),
            facade: facades[Math.floor(Math.random() * facades.length)],
            //comforts: comforts[Math.floor(Math.random() * comforts.length)],
            comforts: comforts.sort(() => Math.random() - Math.random()).slice(0, comforts.length),
            state: states[Math.floor(Math.random() * states.length)],
            rooms: Math.floor(Math.random() * (20 - 10) + 10),
            floor: floors[Math.floor(Math.random() * floors.length)],
            door: doors[Math.floor(Math.random() * doors.length)],
            bathrooms: Math.floor(Math.random() * (10 - 1) + 1),
            rules: rules[Math.floor(Math.random() * rules.length)],
            featuredImage: faker.image.city(),
            images: [
              faker.random.image(),
            ],
            conditions: {
              deposit: '1 Mes de Fianza',
              availability: faker.date.future(),
              minPermanence: '1 año',
              maxPermanence: 'No especificado',
              energeticCertification: 'A'
            }
          })
          //Math.random() * (max - min + 1) + min
          property.save()

            .then(p => {
              for (let k = 0; k < 10; k++) {
                const contact = new Contact({
                  user: userIds[Math.floor(Math.random() * userIds.length)],
                  text: faker.lorem.words(),
                  property: p.id
                })
                contact.save()

                .then(() => {
                  for (let l = 0; l < 10; l++) {
                    const comment = new Comment({
                      text: faker.lorem.words(),
                      fromUser: userIds[Math.floor(Math.random() * userIds.length)],
                      toUser: userIds[Math.floor(Math.random() * userIds.length)],
                    })
                    comment.save()

                      .then(p => {
                        for (let m = 0; m < 10; m++) {
                          const booking = new Booking({
                            fromUser: userIds[Math.floor(Math.random() * userIds.length)],
                            property: p.id,
                            status: 'Pendiente',
                            date: faker.date.future(),
                            time: Math.floor(Math.random() * (22 - 9) + 9) 
                          })
                          booking.save()
                        }
                      }).catch(console.error)
                  }
                }).catch(console.error)
                
              }
            }).catch(console.error)
        }
      }).catch(console.error)
    }
  }).catch(console.error)


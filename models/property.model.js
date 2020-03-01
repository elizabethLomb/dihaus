const mongoose = require('mongoose');

const types = require('../constants/types');
const comforts = require('../constants/comforts');
const rules = require('../constants/rules');
const propertyType = require('../constants/propertyType');
const floors = require('../constants/floors');
const doors = require('../constants/doors');
const states = require('../constants/states');
const facades = require('../constants/facades');

const propertySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyType: {
    type: String,
    enum: propertyType,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    min: 0,
    required: true
  },
  location: {
    type: {
      type: ['Point'],
      //enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  city: {
    type: String,
    required: true,
    lowercase: true
  },
  type: {
    type: String,
    enum: types,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  //mtros útiles
  size: {
    type: Number,
    required: true   
  },
  facade: {
    type: String,
    enum: facades
  },
  comforts: {
    type: [String],
    enum: comforts,
    required: true,
  },
  state: {
    type: String,
    enum: states,
    required: true
  },
  rooms: {
    type: Number,
    required: true
  },
  floor: {
    type: String,
    enum: floors,
    required: true
  },
  door: {
    type: String,
    enum: doors,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  rules: {
    type: [String],
    enum: rules,
    required: true,
  },
  featuredImage: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    default: ''
  },
  furnished: {
    type: String,
    enum: ['Si', 'No'],
    required: true
  },
  conditions: {
    deposit: {
      type: String,
      default: '1 Mes de Fianza',
      required: true
    },
    availability: {
      type: Date,
      default: Date.now,
      required: true
    },
    minPermanence: { type: String, required: true },
    maxPermanence: { type: String, required: true },
    energeticCertification: { type: String }
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = doc._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
})

propertySchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'property',
  justOne: false,
});

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;

/*
{
  "propertyType": "Piso",
  "title": "Bueno, bonito y barato",
  "price": 550,
  "location": "",
  "address": "Madrid",
  "type": "Alquiler",
  "description": "Hola esta es una prueba",
  "size": 80,
  "facade": "Exterior",
  "comforts": ["TV", "Terraza", "Calefacción", "Piscina", "Entrada independiente"],
  "state": "A estrenar",
  "rooms": 3,
  "floor": "Última planta",
  "door": "Exterior Derecha",
  "bathrooms": 3,
  "rules": ["Se permite fumar", "Se permite mascotas"],
  "images": "",
  "conditions": {
    "deposit": "2 Meses",
    "availability": "1985-01-23",
    "minPermanence": "2 años",
    "maxPermanence": "indefinido",
    "energeticCertification": "None"
  }
}

//creada
{
    "conditions": {
        "deposit": [
            "2 Meses"
        ],
        "availability": "1985-01-23T00:00:00.000Z",
        "minPermanence": "2 años",
        "maxPermanence": "indefinido",
        "energeticCertification": "None"
    },
    "comforts": [
        "TV",
        "Terraza",
        "Portero",
        "Piscina",
        "Entrada independiente"
    ],
    "rules": [
        "Se permite fumar",
        "Se permite mascotas"
    ],
    "images": null,
    "user": "5e41776a6f8cfd5f47ff570b",
    "propertyType": "Piso",
    "title": "Bueno, bonito y barato",
    "price": 550,
    "address": "Madrid",
    "type": "Alquiler",
    "description": "Hola esta es una prueba",
    "size": 80,
    "facade": "Exterior",
    "state": "Buen estado",
    "rooms": 3,
    "floor": "Última planta",
    "door": "Exterior Derecha",
    "bathrooms": 3,
    "createdAt": "2020-02-10T16:20:27.674Z",
    "updatedAt": "2020-02-10T16:20:27.674Z",
    "id": "5e4182cb5cb68361bc1898bc"
}


 */
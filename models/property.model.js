const mongoose = require('mongoose');

const types = require('../constants/types');
const comforts = require('../constants/comforts');
const rules = require('../constants/rules');
const propertyType = require('../constants/propertyType');
const floors = require('../constants/floors');
const doors = require('../constants/doors');
const states = require('../constants/states');

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
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: Number,
      required: true
    }
  },
  address: {
    type: String,
    required: true
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
    enum: ['Interior', 'Exterior']
  },
  comforts: {
    type: String,
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
    type: String,
    enum: rules,
    required: true,
  },
  images: {
    type: [String],
    default: ''
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

propertySchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'property',
  justOne: false,
});

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  cardNumber: {
    type: Number,
    required: true,
  },
  cardType: {
    type: String,
    enum: ['AmEx', 'Maes', 'Visa'],
    required: true
  },
  cardName: {
    type: String,
    required: true
  },
  cardMonth: {
    type: Number,
    required: true
  },
  cardYear: {
    type: Number,
    required: true
  },
  cardCVV:  {
    type: Number,
    required: true
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
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pendiente', 'Cancelada', 'Aprobada', 'Activa', 'Completada'],
    default: 'Pendiente'
  },
  date: {
    type: Date,
    required: [true, "Seleccione una fecha para continuar"]
  }
  // ,
  // time: {
  //   type: Number,
  //   required: [true, "Seleccione una hora para continuar"]
  // }
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

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
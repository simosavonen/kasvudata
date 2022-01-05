const mongoose = require('mongoose')

const readingSchema = new mongoose.Schema({
  sensor: mongoose.ObjectId,
  dateTime: Date,
  rainFall: {
    type: Number,
    min: 0,
    max: 1000
  },
  temperature: {
    type: Number,
    min: -100,
    max: 100
  },
  pH: {
    type: Number,
    min: -10,
    max: 10
  }
  
})

readingSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Reading', readingSchema)
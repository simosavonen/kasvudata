const mongoose = require('mongoose')

const readingSchema = new mongoose.Schema({
  _id: false,
  dateTime: { 
    type: Date, 
    required: true
  },
  value: {
    type: Number,
    required: true
  }
})

readingSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = readingSchema
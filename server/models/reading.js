const mongoose = require('mongoose')

const readingSchema = new mongoose.Schema({
  _id: false,
  datetime: { 
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
    delete returnedObject.__v
  }
})

module.exports = readingSchema
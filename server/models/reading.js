const mongoose = require('mongoose')

let tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

const readingSchema = new mongoose.Schema({
  sensor: { type: mongoose.ObjectId, required: true },
  dateTime: { 
    type: Date, 
    required: true,
    max: tomorrow.toISOString().split('T')[0]
  },
  rainFall: {
    type: Number,
    min: 0,
    max: 500    
  },
  temperature: {
    type: Number,
    min: -50,
    max: 100    
  },
  pH: {
    type: Number,
    min: 0,
    max: 14    
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
const mongoose = require('mongoose')

let tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

const minValues = {
  'rainFall': 0,
  'temperature': -50,
  'ph': 0
}

const maxValues = {
  'rainFall': 500,
  'temperature': 100,
  'ph': 14
}

const readingSchema = new mongoose.Schema({ 
  dateTime: { 
    type: Date, 
    required: true,
    max: tomorrow.toISOString().split('T')[0]
  },
  value: {
    type: Number,
    required: true,
    min: function() { return minValues[this.parent.sensorType] },
    max: function() { return maxValues[this.parent.sensorType] }
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
const mongoose = require('mongoose')
const readingSchema = require('./reading')

const sensorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
  },
  sensorType: {
    type: String,
    enum: ['rainFall', 'temperature', 'pH'],
    required: true
  },
  readings: [readingSchema]
})

sensorSchema.index({ name: 1, sensorType: 1 }, { unique: true })

sensorSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Sensor', sensorSchema)
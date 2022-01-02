const mongoose = require('mongoose')

const sensorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
  },
  address: String,
  city: String,
  location: {
    type: {
      type: String, 
      enum: ['Point']
    },
    coordinates: {
      type: [Number] // [longitude, latitude]
    }
  },
  public: Boolean
})

sensorSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Sensor', sensorSchema)
const mongoose = require('mongoose')

let tomorrow = new Date()
tomorrow.setDate(tomorrow.getDate() + 1)

const readingSchema = new mongoose.Schema({
  sensor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Sensor', 
    required: true 
  },
  dateTime: { 
    type: Date, 
    required: true,
    max: tomorrow.toISOString().split('T')[0]
  },
  rainFall: {
    type: Number,
    min: 0,
    max: 500,
    required: function() { return !this.temperature && !this.pH }    
  },
  temperature: {
    type: Number,
    min: -50,
    max: 100,
    required: function() { return !this.rainFall && !this.pH }    
  },
  pH: {
    type: Number,
    min: 0,
    max: 14,
    required: function() { return !this.temperature && !this.rainFall }    
  }  
}, {
  timeseries: {
    timeField: 'dateTime',
    metaField: 'sensor'
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
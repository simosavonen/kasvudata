const sensorsRouter = require('express').Router()
const Sensor = require('../models/sensor')

sensorsRouter.get('/', (request, response) => {
  Sensor.find({}, { readings: { $slice: -30 }}
  ).then(sensors => {
    response.json(sensors.map(sensor => sensor.toJSON()))
  })
})

sensorsRouter.post('/', (request, response, next) => {
  const body = request.body

  const sensor = new Sensor({
    name: body.name,
    sensorType: body.sensorType
  })

  sensor.save()
    .then(savedSensor => {
      response.json(savedSensor.toJSON())
    })
    .catch(error => next(error))
})

module.exports = sensorsRouter
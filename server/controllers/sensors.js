const sensorsRouter = require('express').Router()
const Sensor = require('../models/sensor')

sensorsRouter.get('/', (request, response) => {
  Sensor.find({}, { readings: { $slice: 30 }}
  ).then(sensors => {
    response.json(sensors.map(sensor => sensor.toJSON()))
  })
})

sensorsRouter.get('/:id', (request, response, next) => {
  Sensor.find({ _id: request.params.id})
    .then(sensor => response.json(sensor))
    .catch(error => next(error))
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
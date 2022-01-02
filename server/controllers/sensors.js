const sensorsRouter = require('express').Router()
const Sensor = require('../models/sensor')

sensorsRouter.get('/', (request, response) => {
  Sensor.find({}).then(sensors => {
    response.json(sensors.map(sensor => sensor.toJSON()))
  })
})

sensorsRouter.post('/', (request, response, next) => {
  const body = request.body

  const sensor = new Sensor({
    name: body.name,
    address: body.address,
    city: body.city,
    location: body.location,
    public: body.public || true
  })

  sensor.save()
    .then(savedSensor => {
      response.json(savedSensor.toJSON())
    })
    .catch(error => next(error))
})

module.exports = sensorsRouter
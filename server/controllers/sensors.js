const sensorsRouter = require('express').Router()
const Sensor = require('../models/sensor')

/**
 * @openapi
 * /sensors:
 *   get:
 *     summary: Returns all the sensors and the 30 most recent readings for each sensor.
 *     tags:
 *       - sensors
 *     responses:
 *       200:
 *         description: all the sensors and the 30 most recent readings for each sensor
 *         content:
 *           'application/json':
 *             schema:
 *               $ref: "#/components/schemas/Sensor"        
 */
sensorsRouter.get('/', (request, response) => {
  Sensor.find({}, { readings: { $slice: 30 }}
  ).then(sensors => {
    response.status(200).json(sensors.map(sensor => sensor.toJSON()))
  })
})

/**
 * @openapi
 * /sensors/{id}:
 *   get:
 *     summary: Returns one sensor and all the readings for it.
 *     tags:
 *       - sensors
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The MongoDB ObjectId of the sensor to get
 *     responses:
 *       200:
 *         description: a sensor and it's full readings data
 *         content:
 *           'application/json':
 *             schema:
 *               $ref: "#/components/schemas/Sensor"
 */
sensorsRouter.get('/:id', (request, response, next) => {
  Sensor.find({ _id: request.params.id})
    .then(sensor => response.status(200).json(sensor))
    .catch(error => next(error))
})

/**
 * @openapi
 * /sensors:
 *   post:
 *     summary: Add a new sensor
 *     tags:
 *       - sensors
 *     requestBody:
 *       required: true
 *       content:
 *         'application/json':
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sensorType
 *             properties:
 *               name:
 *                 type: string
 *                 description: name of the sensor
 *               sensorType:
 *                 type: string
 *                 enum:
 *                   - rainFall
 *                   - temperature
 *                   - pH
 *                 description: one of the predefined types for sensors
 *     responses:
 *       '201':
 *         description: the created Sensor, with an ObjectId and an empty readings array.
 *         content:
 *           'application/json':
 *             schema:
 *               $ref: '#/components/schemas/Sensor'
 */
sensorsRouter.post('/', (request, response, next) => {
  const body = request.body

  const sensor = new Sensor({
    name: body.name,
    sensorType: body.sensorType
  })

  sensor.save()
    .then(savedSensor => {
      response.status(201).json(savedSensor.toJSON())
    })
    .catch(error => next(error))
})

module.exports = sensorsRouter
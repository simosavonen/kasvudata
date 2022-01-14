/**
 * @swagger
 * components:
 *   schemas:
 *     Sensor:
 *       type: object
 *       required:
 *         - name
 *         - sensorType
 *       properties:
 *         id:
 *           type: ObjectId
 *           description: The Auto-generated id
 *         name:
 *           type: string
 *           description: name of the sensor
 *         sensorType:
 *           type: string
 *           enum: [rainFall, temperature, pH]
 *           descripton: type of the sensor
 *       example:
 *         id: 61ddf9fc9197349c2a368ee4
 *         name: Weather tower Alpha
 *         sensorType: rainFall
 *
 */
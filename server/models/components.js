/**
 * @openapi
 * components:
 *   schemas:
 *     Sensor:        
 *       *sensor
 *     Reading:
 *       *reading
 *     ValidationError:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         name: 
 *           type: string
 *         dateTime:
 *           type: string
 *           format: date-time
 *         sensorType:
 *           type: string
 *         value:
 *           type: number         
 */
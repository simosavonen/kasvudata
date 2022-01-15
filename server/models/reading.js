const mongoose = require('mongoose')

/**
 * @openapi
 * Reading: &reading
 *   type: object
 *   required:
 *     - datetime
 *     - value
 *   properties:
 *     datetime:
 *       type: string
 *       format: date-time
 *       description: When the reading was taken
 *     value:
 *       type: number
 *       description: Value of the reading
 */
const readingSchema = new mongoose.Schema({
  _id: false,
  datetime: { 
    type: Date, 
    required: true
  },
  value: {
    type: Number,
    required: true
  }
})

readingSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v
  }
})

module.exports = readingSchema
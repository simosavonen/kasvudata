const filesRouter = require('express').Router()
const Sensor = require('../models/sensor')
const path = require('path')
const busboy = require('busboy')
const { parse } = require('fast-csv')
const logger = require('../utils/logger')
const dayjs = require('dayjs')

const validate = (row) => {
  const errors = []
  const tomorrow = dayjs().add('1', 'day')
  const date = dayjs(row.datetime)
  
  const minValues = {
    'rainFall': 0,
    'temperature': -50,
    'pH': 0
  }
  
  const maxValues = {
    'rainFall': 500,
    'temperature': 100,
    'pH': 14
  }

  const headers = ['location', 'datetime', 'sensorType', 'value']
  const validHeaders = Object.keys(row).every(header => headers.includes(header))
  if(!validHeaders || minValues[row.sensorType] === undefined) {
    errors.push({ error: 'missing a property', ...row })
    return errors
  }
    
  if(row.value < minValues[row.sensorType])
    errors.push({ error: 'value is too low', ...row })

  if(row.value > maxValues[row.sensorType])
    errors.push({ error: 'value is too high', ...row })

  if(!date.isBefore(tomorrow))
    errors.push({ error: 'datetime is in the future', ...row })

  return errors

}

const saveToDatabase = async (data) => {
  if(data.length == 0 || data[0].location === undefined) {
    logger.error('saveToDatabase was given bad data')
    return 
  }

  const readings = {
    rainFall: [],
    temperature: [],
    pH: []
  }
  
  const validationErrors = []
  for (const row of data) {
    const errors = validate(row)
    validationErrors.push(...errors)
    if(errors.length === 0)       
      readings[row.sensorType].push({ datetime: row.datetime, value: row.value })          
  }

  try {
    for (const sensorType in readings) {
      // prevent duplicates while adding readings      
      await Sensor.findOneAndUpdate(
        { name: data[0].location, sensorType: sensorType },
        { $addToSet: { readings: { $each: readings[sensorType] }}},
        { upsert: true }
      )
      // sort the readings in descending order
      await Sensor.findOneAndUpdate(
        { name: data[0].location, sensorType: sensorType },
        { $push: { readings: { $each: [], $sort: { datetime: -1 }}}}
      )
    }   
  } catch (error) {
    logger.error(error)
  }
  return Promise.resolve(validationErrors) 
}


/**
 * @openapi
 * /files:
 *   get:
 *     summary: Serves a HTML form for uploading CSV data.
 *     tags:
 *       - files
 *     responses:
 *       '200':
 *         description: A HTML form
 */
filesRouter.get('/', (request, response) => {
  response.sendFile(path.resolve('static', 'upload_csv.html'))
})

/**
 * @openapi
 * /files:
 *   post:
 *     summary: Parses the uploaded CSV file
 *     tags:
 *       - files
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: Report on how many passed validation
 *         content:
 *           'application/json':
 *             schema:
 *               type: object
 *               properties:
 *                 parsed:
 *                   type: number
 *                   description: number of rows parsed
 *                 validated:
 *                   type: number
 *                   description: number of validated rows
 *                 errors:
 *                   type: array
 *                   description: the rows that failed validation and the reasons
 *                   items:
 *                     $ref: '#/components/schemas/ValidationError'            
 */
filesRouter.post('/', (request, response) => {
  let rows = []
  const validationErrors = []
 
  const bb = busboy({ headers: request.headers })
  bb.on('file', (name, file) => {
    const parser = parse({ headers: true, ignoreEmpty: true })
    file.pipe(parser)
      .on('error', error => logger.error(error))
      .on('data', async row => {        
        rows.push(row)
        if(rows.length > 999) {
          parser.pause()
          const result = await saveToDatabase(rows)            
          rows = []
          validationErrors.push(...result)
          parser.resume()                
        }        
      }) 
      .on('end', async rowCount => {
        if(rows.length > 0) {
          const result = await saveToDatabase(rows)            
          validationErrors.push(...result)
          response.status(201).json({ 
            parsed: rowCount,
            validated: rowCount - validationErrors.length,
            errors: validationErrors              
          })                  
        }
      })
  })   
  bb.on('close', () => { 
    
  })
  request.pipe(bb)
})

module.exports = filesRouter
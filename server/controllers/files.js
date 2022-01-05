const filesRouter = require('express').Router()
const Reading = require('../models/reading')
const Sensor = require('../models/sensor')
const path = require('path')
const busboy = require('busboy')
const { parse } = require('fast-csv')
const logger = require('../utils/logger')

const saveToDatabase = async ( data ) => {
  if(data.length == 0 || data[0].location === undefined) {
    logger.error('saveToDatabase was given bad data')
    return
  }

  const sensorName = data[0].location
  const query = { name: sensorName }
  const update = { lastUpdated: Date.now() }
  const options = { upsert: true, returnDocument: 'after' }

  const sensor = await Sensor.findOneAndUpdate(query, update, options)
  
  const readings = data.map(row => {
    let reading = {
      sensor: sensor._id,
      dateTime: new Date(row.datetime)
    }
    if(row.sensorType === 'rainFall') reading = { ...reading, rainFall: row.value }
    if(row.sensorType === 'temperature') reading = { ...reading, temperature: row.value }
    if(row.sensorType === 'pH') reading = { ...reading, pH: row.value }

    return reading
  })
  
  const results = await Reading.insertMany(readings, { ordered: false, rawResult: true })

  const skipped = results.mongoose.validationErrors.length
  if(results.insertedCount) logger.info(results.insertedCount + ' readings inserted to database')
  if(skipped) logger.error(skipped + ' readings rejected due to validation error')  
}

filesRouter.get('/', (request, response) => {
  response.sendFile(path.resolve('static', 'upload_csv.html'))
})

filesRouter.post('/', (request, response) => {
  let rows = []

  const bb = busboy({ headers: request.headers })
  bb.on('file', (name, file) => {
    const parser = parse({ headers: true })
    file.pipe(parser)
      .on('error', error => logger.error(error))
      .on('data', row => {        
        rows.push(row)
        if(rows.length > 999) {
          parser.pause()
          saveToDatabase(rows)
          rows = []
          parser.resume()
        }        
      }) 
      .on('end', rowCount => {
        if(rows.length > 0) saveToDatabase(rows)
        logger.info(`Parsed ${rowCount} rows`) 
      })
  })   
  bb.on('close', () => {
    logger.info('Done parsing form!')    
    response.writeHead(303, { Connection: 'close', Location: '/api/files' })
    response.end()
  })
  request.pipe(bb)
})

module.exports = filesRouter
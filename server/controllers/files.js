const filesRouter = require('express').Router()
const Reading = require('../models/reading')
const Sensor = require('../models/sensor')
const path = require('path')
const busboy = require('busboy')
const { parse } = require('fast-csv')
const logger = require('../utils/logger')

const saveToDatabase = async (data) => {
  if(data.length == 0 || data[0].location === undefined) {
    logger.error('saveToDatabase was given bad data')
    return 
  }
  
  const query = { name: data[0].location }
  const update = { lastUpdated: Date.now() }
  const options = { upsert: true, returnDocument: 'after' }
  const sensor = await Sensor.findOneAndUpdate(query, update, options)
  
  const readings = data.map(row => {    
    const sensorType = row.sensorType.toLowerCase()
    if(!['rainfall', 'temperature', 'ph'].includes(sensorType)) return 

    let reading = {
      sensor: sensor._id,
      dateTime: new Date(row.datetime)
    }
    
    if(sensorType === 'rainfall') reading = { ...reading, rainFall: row.value }
    if(sensorType === 'temperature') reading = { ...reading, temperature: row.value }
    if(sensorType === 'ph') reading = { ...reading, pH: row.value }
    
    return reading
  })
  
  const results = await Reading.insertMany(readings, { ordered: false, rawResult: true })
  
  const saved = results.insertedCount ? results.insertedCount : 0
  const rejected = results.mongoose.validationErrors.length ? results.mongoose.validationErrors.length : 0  
  logger.info(`Parsed ${data.length} readings, ${saved} were saved, ${rejected} were rejected.`)
}

filesRouter.get('/', (request, response) => {
  response.sendFile(path.resolve('static', 'upload_csv.html'))
})

filesRouter.post('/', (request, response) => {
  let rows = []  

  const bb = busboy({ headers: request.headers })
  bb.on('file', (name, file) => {
    const parser = parse({ headers: true, ignoreEmpty: true })
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
        response.status(201).json({ parsed: rowCount })     
      })
  })   
  bb.on('close', () => { 
    logger.info('busboy finished')
  })
  request.pipe(bb)
})

module.exports = filesRouter
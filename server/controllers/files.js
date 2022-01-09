const filesRouter = require('express').Router()
const Sensor = require('../models/sensor')
const path = require('path')
const busboy = require('busboy')
const { parse } = require('fast-csv')
const logger = require('../utils/logger')

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

const isValidated = (row) => {
  return row.value >= minValues[row.sensorType] && 
    row.value <= maxValues[row.sensorType]
}

const saveToDatabase = async (data) => {
  if(data.length == 0 || data[0].location === undefined) {
    logger.error('saveToDatabase was given bad data')
    return 
  }

  const readings = {
    name: data[0].location,
    rainFall: [],
    temperature: [],
    pH: []
  }

  for (const row of data) {
    if(readings[row.sensorType] !== undefined && Array.isArray(readings[row.sensorType]))
      if(isValidated(row)) readings[row.sensorType].push(
        { 
          dateTime: row.datetime, 
          value: row.value 
        })
  }

  try {

    if(readings.rainFall.length) await Sensor.findOneAndUpdate(
      { name: readings.name, sensorType: 'rainFall'}, 
      { $addToSet: { readings: { $each: readings.rainFall }}}, 
      { upsert: true })      
    
    if(readings.temperature.length) await Sensor.findOneAndUpdate(
      { name: readings.name, sensorType: 'temperature'}, 
      { $addToSet: { readings: { $each: readings.temperature }}}, 
      { upsert: true })
  
    if(readings.pH.length) await Sensor.findOneAndUpdate(
      { name: readings.name, sensorType: 'pH'}, 
      { $addToSet: { readings: { $each: readings.pH }}}, 
      { upsert: true })

  } catch (error) {
    logger.error(error)
  }  
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
            .then(() => {
              rows = []
              parser.resume()
            })      
        }        
      }) 
      .on('end', rowCount => {
        if(rows.length > 0) {
          saveToDatabase(rows)            
          response.status(201).json({ parsed: rowCount })           
        }
      })
  })   
  bb.on('close', () => { 
    
  })
  request.pipe(bb)
})

module.exports = filesRouter
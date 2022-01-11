const filesRouter = require('express').Router()
const Sensor = require('../models/sensor')
const path = require('path')
const busboy = require('busboy')
const { parse } = require('fast-csv')
const logger = require('../utils/logger')
const dayjs = require('dayjs')

const isValidated = (row) => {
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

  return minValues[row.sensorType] !== undefined &&
         row.value >= minValues[row.sensorType] && 
         row.value <= maxValues[row.sensorType] &&
         date.isBefore(tomorrow)
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

  for (const row of data) {    
    if(isValidated(row)) 
      readings[row.sensorType].push({ datetime: row.datetime, value: row.value })
  }

  try {
    for (const sensorType in readings) {      
      await Sensor.findOneAndUpdate(
        { name: data[0].location, sensorType: sensorType },
        { $addToSet: { readings: { $each: readings[sensorType] }}},
        { upsert: true }
      )
    }   
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
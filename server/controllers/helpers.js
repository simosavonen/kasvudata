const dayjs = require('dayjs')
const logger = require('../utils/logger')
const Sensor = require('../models/sensor')

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
  const validationErrors = []
  const readings = {
    rainFall: [],
    temperature: [],
    pH: []
  }
  
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
  return validationErrors 
}

module.exports = {
  validate,
  saveToDatabase
}
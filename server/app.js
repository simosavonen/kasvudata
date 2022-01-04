const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
const app = express()

const sensorsRouter = require('./controllers/sensors')
const filesRouter = require('./controllers/files')

const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(express.json())

app.use('/api/sensors', sensorsRouter)
app.use('/api/files', filesRouter)

module.exports = app
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const express = require('express')
const app = express()

const sensorsRouter = require('./controllers/sensors')
const filesRouter = require('./controllers/files')

const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const openApiSpecifications = swaggerJsDoc(config.SWAGGER_OPTIONS)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openApiSpecifications))

const mongoose = require('mongoose')
//mongoose.set('debug', true)

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

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
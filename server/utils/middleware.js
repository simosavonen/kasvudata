const logger = require('./logger')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if(error.name === 'CastError')
    return response.status(400).send({ error: 'malformatted id' })
   
  if(error.name === 'ValidationError') 
    return response.status(400).send({ 
      error: 'validation failed',
      message: error.message
    })
   
  logger.error(error.message)
  next(error)
}

module.exports = { unknownEndpoint, errorHandler }
const filesRouter = require('express').Router()
const path = require('path')
const busboy = require('busboy')
const logger = require('../utils/logger')

filesRouter.get('/', (request, response) => {
  response.sendFile(path.resolve('static', 'upload_csv.html'))
})

filesRouter.post('/', (request, response) => {
  const bb = busboy({ headers: request.headers })
  bb.on('file', (name, file, info) => {
    const { filename, encoding, mime } = info
    logger.info(
      `File [${name}]: filename: %j, encoding: %j, mime: %j`,
      filename,
      encoding,
      mime
    )
    file.on('data', (data) => {
      logger.info(`File [${name}] got ${data.length} bytes`)
      // todo: parse the csv into JSON and add to MongoDB in bulk
    }).on('close', () => {
      logger.info(`File [${name}] done`)
    })
  }) 
  bb.on('close', () => {
    logger.info('Done parsing form!')
    response.writeHead(303, { Connection: 'close', Location: '/' })
    response.end()
  })
  request.pipe(bb)
})

module.exports = filesRouter
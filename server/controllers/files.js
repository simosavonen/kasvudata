const filesRouter = require('express').Router()
const path = require('path')
const busboy = require('busboy')
const { parse } = require('fast-csv')
const logger = require('../utils/logger')
const { saveToDatabase } = require('./helpers')

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
 *     summary: Parses the uploaded CSV file, saves readings to the database, discarding duplicates.
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
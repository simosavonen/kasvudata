const express = require('express')
const app = express()

const sensorsRouter = require('./controllers/sensors')

app.use('/api/sensors', sensorsRouter)

module.exports = app
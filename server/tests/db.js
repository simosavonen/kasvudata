const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const logger = require('../utils/logger')

let mongoServer
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

const connect = async () => {
  await mongoose.disconnect()
  
  mongoServer = await MongoMemoryServer.create()
  
  const mongoUri = mongoServer.getUri()
  mongoose.connect(mongoUri, options, error => {
    if (error) {
      logger.error(error)
    }
  })
}

const close = async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
}

const clear = async () => {
  const collections = mongoose.connection.collections
  
  for (const key in collections) {
    await collections[key].deleteMany()
  }
}
  
module.exports = {
  connect,
  close,
  clear,
}
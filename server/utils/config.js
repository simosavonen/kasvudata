require('dotenv').config()

const PORT = process.env.PORT || 3001

const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

const SWAGGER_OPTIONS = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kasvudata API',
      version: '1.0.0',
      description: 'Upload and review sensor readings to keep the crops happy and your farm productive.',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./controllers/*.js', './models/*.js'],
}

module.exports = {
  MONGODB_URI,
  PORT,
  SWAGGER_OPTIONS
}
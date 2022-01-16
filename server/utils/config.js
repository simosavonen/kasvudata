require('dotenv').config()

const PORT = process.env.NODE_DOCKER_PORT || 8080
const LOCAL_PORT = process.env.NODE_LOCAL_PORT || 6868

const {
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env

const MONGODB_URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`

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
        url: `http://localhost:${LOCAL_PORT}/api`,
        description: 'Development server'
      }
    ],
  },
  apis: ['./controllers/*.js', './models/*.js'],
}

module.exports = {
  MONGODB_URI,
  PORT,
  SWAGGER_OPTIONS
}
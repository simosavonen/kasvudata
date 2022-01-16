const supertest = require('supertest')
const app = require('../app')
const db = require('./db')

const api = supertest(app)

beforeAll(async () => await db.connect())
beforeEach(async () => await db.clear())
afterAll(async () => await db.close())

describe('POST /api/sensors', () => {
  test('It should store a new sensor', async () => {
    await api
      .post('/api/sensors')
      .send({ name: 'Test sensor', sensorType: 'rainFall' })
      .expect(201)
      .then(res => {
        expect(res.body.id).toBeTruthy()
      })
  })

  test('Missing sensorType should be rejected', async () => {
    await api
      .post('/api/sensors')
      .send({ name: 'Invalid sensor' })
      .expect(400)
      .then(res => {
        expect(res.body.error).toBe('validation failed')
      })
  })

  test('Wrong sensorType should be rejected', async () => {
    await api
      .post('/api/sensors')
      .send({ name: 'Invalid sensor', sensorType: 'wind' })
      .expect(400)
      .then(res => {
        expect(res.body.error).toBe('validation failed')
      })
  })

  test('Missing name should be rejected', async () => {
    await api
      .post('/api/sensors')
      .send({ sensorType: 'pH' })
      .expect(400)
      .then(res => {
        expect(res.body.error).toBe('validation failed')
      })
  })
})

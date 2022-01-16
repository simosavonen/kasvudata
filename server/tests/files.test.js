const supertest = require('supertest')
const app = require('../app')
const db = require('./db')

const api = supertest(app)

beforeAll(async () => await db.connect())
beforeEach(async () => await db.clear())
afterAll(async () => await db.close())

describe('POST /api/files', () => {
  test('Valid CSV file should be parsed and stored', async () => {
    await api
      .post('/api/files')
      .attach('file', `${__dirname}/../csv/Nooras_farm_short.csv`)
      .expect(201)
      .then(result => {
        expect(result.body.parsed).toBe(3)
        expect(result.body.validated).toBe(3)
      })
  })

  test('CSV file with invalid rows should show them as rejected', async () => {
    await api
      .post('/api/files')
      .attach('file', `${__dirname}/../csv/Nooras_farm_some_invalid.csv`)
      .expect(201)
      .then(result => {
        expect(result.body.parsed).toBe(7)
        expect(result.body.validated).toBe(3)
        expect(result.body.errors.length).toBe(4)
      })
  })
})

const sensorsRouter = require('express').Router()

sensorsRouter.get('/', (request, response) => {
  response.status(200).json({
    '_links': {
      'list': {
        'href': '/list'
      },
    }
  })
})

module.exports = sensorsRouter
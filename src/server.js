require('dotenv').config()

const Hapi = require('@hapi/hapi')
const albums = require('./api/albums')
const AlbumsService = require('./services/postgres/albums-service')
const AlbumsValidator = require('./validator/albums')
const ClientError = require('./exceptions/client-error')

const init = async () => {
  const albumService = new AlbumsService()

  const server = Hapi.server({
    port: process.env.SERVER_PORT,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : process.env.SERVER_HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  // resgiter the plugins
  await server.register({
    plugin: albums,
    options: {
      service: albumService,
      validator: AlbumsValidator
    }
  })

  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message
      })

      newResponse.code(response.statusCode)
      return newResponse
    }

    return h.continue
  })

  await server.start()
  console.log(`Server running on ${server.info.uri}...`)
}

init()

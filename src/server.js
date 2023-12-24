require('dotenv').config()

const Hapi = require('@hapi/hapi')
const albums = require('./api/albums')
const songs = require('./api/songs')
const AlbumsService = require('./services/postgres/albums-service')
const SongsService = require('./services/postgres/songs-service')
const AlbumsValidator = require('./validator/albums')
const SongsValidator = require('./validator/songs')
const ClientError = require('./exceptions/client-error')

const init = async () => {
  const albumsService = new AlbumsService()
  const songsService = new SongsService()

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
  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator
      }
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator
      }
    }
  ])

  server.ext('onPreResponse', (request, h) => {
    const { response } = request

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message
        })

        newResponse.code(response.statusCode)
        return newResponse
      }

      if (!response.isServer) {
        return h.continue
      }

      const newResponse = h.response({
        status: 'fail',
        message: 'Terjadi kegagalan pada internal server'
      })

      newResponse.code(500)
      return newResponse
    }

    return h.continue
  })

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}...`)
}

init()

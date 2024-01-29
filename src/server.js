require('dotenv').config()

const Hapi = require('@hapi/hapi')
const ServerPlugins = require('./plugins')
const ServerEventExtensions = require('./event-extensions')
const credentials = require('../config/credentials')

const init = async () => {
  const server = Hapi.server({
    port: credentials.server.port,
    host: credentials.server.host,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await ServerPlugins(server)
  server.ext('onPreResponse', (request, h) => ServerEventExtensions(request, h))

  await server.start()
  console.log(`Server running on ${server.info.uri}...`)
}

init()

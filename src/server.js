require('dotenv').config()

const Hapi = require('@hapi/hapi')

const init = async () => {
  const server = Hapi.server({
    port: process.env.SERVER_PORT,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : process.env.SERVER_HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.start()
  console.log(`Server running on ${server.info.uri}...`)
}

init()

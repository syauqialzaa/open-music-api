const credentials = {
  server: {
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : process.env.SERVER_HOST,
    port: process.env.SERVER_PORT
  },
  jwt: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
    accessTokenAge: process.env.ACCESS_TOKEN_AGE
  },
  rabbitmq: {
    server: process.env.RABBITMQ_SERVER
  }
}

module.exports = credentials

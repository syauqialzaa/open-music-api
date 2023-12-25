const ClientError = require('./exceptions/client-error')

const ServerEventExtensions = (request, h) => {
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
      message: 'Internal server error has occured.'
    })

    newResponse.code(500)
    return newResponse
  }

  return h.continue
}

module.exports = ServerEventExtensions

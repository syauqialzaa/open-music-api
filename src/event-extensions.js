const ClientError = require('./exceptions/client-error')
const { internalServerErrorResponse, clientErrorResponse } = require('./responses')

const ServerEventExtensions = (request, h) => {
  const { response } = request

  if (response instanceof Error) {
    if (response instanceof ClientError) {
      return clientErrorResponse(response, h)
    }

    if (!response.isServer) {
      return h.continue
    }

    return internalServerErrorResponse(h, 'Internal server error has occured.')
  }

  return h.continue
}

module.exports = ServerEventExtensions

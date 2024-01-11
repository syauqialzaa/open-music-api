const ClientError = require('./exceptions/client-error')
const { internalServerErrorResponse, clientErrorResponse } = require('./responses')

const ServerEventExtensions = (request, h) => {
  const { response } = request

  if (response instanceof Error) {
    if (response instanceof ClientError) {
      // const newResponse = h.response({
      //   status: 'fail',
      //   message: response.message
      // })

      // newResponse.code(response.statusCode)
      // return newResponse
      return clientErrorResponse(response, h)
    }

    if (!response.isServer) {
      return h.continue
    }

    // const newResponse = h.response({
    //   status: 'fail',
    //   message: 'Internal server error has occured.'
    // })

    // newResponse.code(500)
    // return newResponse
    return internalServerErrorResponse(h, 'Internal server error has occured.')
  }

  return h.continue
}

module.exports = ServerEventExtensions

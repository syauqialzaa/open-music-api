const success = {
  status: 'success',
  post: { code: 201 },
  request: { code: 200 }
}

const fail = {
  status: 'fail',
  internalServerError: { code: 500 }
}

const postSuccessResponse = (h, { message = undefined, data = undefined }) => {
  const response = h.response({
    status: success.status,
    message,
    data
  })

  response.code(success.post.code)
  return response
}

const requestSuccessResponse = (h, { message = undefined, data = undefined }) => {
  const response = h.response({
    status: success.status,
    message,
    data
  })

  response.code(success.request.code)
  return response
}

const requestCacheSuccessResponse = (h, { message = undefined, data = undefined }) => {
  const response = h.response({
    status: success.status,
    message,
    data
  })

  response.code(success.request.code)
  response.header('X-Data-Source', 'cache')

  return response
}

const clientErrorResponse = (resp, h) => {
  const response = h.response({
    status: fail.status,
    message: resp.message
  })

  response.code(resp.statusCode)
  return response
}

const internalServerErrorResponse = (h, message) => {
  const response = h.response({
    status: fail.status,
    message
  })

  response.code(fail.internalServerError.code)
  return response
}

module.exports = {
  postSuccessResponse,
  requestSuccessResponse,
  requestCacheSuccessResponse,
  clientErrorResponse,
  internalServerErrorResponse
}

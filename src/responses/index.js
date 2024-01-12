const postSuccess = { status: 'success', code: 201 }
const requestSuccess = { status: 'success', code: 200 }

const clientError = { status: 'fail' }
const internalServerError = { status: 'fail', code: 500 }

const postSuccessResponse = (h, message, data) => {
  const response = h.response({
    status: postSuccess.status,
    message,
    data
  })

  response.code(postSuccess.code)
  return response
}

const requestSuccessResponse = (h, message, data) => {
  const response = h.response({
    status: requestSuccess.status,
    message,
    data
  })

  response.code(requestSuccess.code)
  return response
}

const clientErrorResponse = (resp, h) => {
  const response = h.response({
    status: clientError.status,
    message: resp.message
  })

  response.code(resp.statusCode)
  return response
}

const internalServerErrorResponse = (h, message) => {
  const response = h.response({
    status: internalServerError.status,
    message
  })

  response.code(internalServerError.code)
  return response
}

module.exports = { postSuccessResponse, requestSuccessResponse, clientErrorResponse, internalServerErrorResponse }

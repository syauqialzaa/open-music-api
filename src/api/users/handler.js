const autoBind = require('auto-bind')
const { postSuccessResponse, requestSuccessResponse } = require('../../responses')

class UsersHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postUserHandler (request, h) {
    this._validator.validateUserPayload(request.payload)
    const { username, password, fullname } = request.payload
    const userId = await this._service.addUser({ username, password, fullname })

    return postSuccessResponse(h, 'User added successfully.', { userId })
  }

  async getUserByIdHandler (request, h) {
    const { id } = request.params
    const user = await this._service.getUserById(id)

    return requestSuccessResponse(h, undefined, { user })
  }
}

module.exports = UsersHandler

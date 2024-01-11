const autoBind = require('auto-bind')
const { postSuccessResponse, requestSuccessResponse } = require('../../responses')

class AuthenticationsHandler {
  constructor (authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService
    this._usersService = usersService
    this._tokenManager = tokenManager
    this._validator = validator

    autoBind(this)
  }

  async postAuthenticationHandler (request, h) {
    this._validator.validatePostAuthenticationPayload(request.payload)
    const { username, password } = request.payload
    const id = await this._usersService.verifyUserCredential(username, password)

    const accessToken = this._tokenManager.generateAccessToken({ id })
    const refreshToken = this._tokenManager.generateRefreshToken({ id })

    await this._authenticationsService.addRefreshToken(refreshToken)
    return postSuccessResponse(h, 'Authentication added successfully.', { accessToken, refreshToken })
  }

  async putAuthenticationHandler (request, h) {
    this._validator.validatePutAuthenticationPayload(request.payload)
    const { refreshToken } = request.payload

    await this._authenticationsService.verifyRefreshToken(refreshToken)
    const { id } = this._tokenManager.verifyRefreshToken(refreshToken)

    const accessToken = this._tokenManager.generateAccessToken({ id })
    return requestSuccessResponse(h, 'Access token updated successfully.', { accessToken })
  }

  async deleteAuthenticationHandler (request, h) {
    this._validator.validateDeleteAuthenticationPayload(request.payload)
    const { refreshToken } = request.payload

    await this._authenticationsService.verifyRefreshToken(refreshToken)
    await this._authenticationsService.deleteRefreshToken(refreshToken)

    return requestSuccessResponse(h, 'Refresh token deleted successfully.', undefined)
  }
}

module.exports = AuthenticationsHandler

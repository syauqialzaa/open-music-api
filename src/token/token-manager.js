const Jwt = require('@hapi/jwt')
const InvariantError = require('../exceptions/invariant-error')
const credentials = require('../../config/credentials')

const TokenManager = {
  generateAccessToken: payload => Jwt.token.generate(payload, credentials.jwt.accessTokenKey),
  generateRefreshToken: payload => Jwt.token.generate(payload, credentials.jwt.refreshTokenKey),
  verifyRefreshToken: refreshToken => {
    try {
      const artifacts = Jwt.token.decode(refreshToken)
      Jwt.token.verifySignature(artifacts, credentials.jwt.refreshTokenKey)
      const { payload } = artifacts.decoded
      return payload
    } catch (error) {
      throw new InvariantError('Refresh token is invalid.')
    }
  }
}

module.exports = TokenManager

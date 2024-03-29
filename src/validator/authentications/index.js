const InvariantError = require('../../exceptions/invariant-error')
const { PostAuthenticationPayloadSchema, PutAuthenticationPayloadSchema, DeleteAuthenticationPayloadSchema } = require('./schema')

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: payload => {
    const validationResult = PostAuthenticationPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
    return validationResult
  },
  validatePutAuthenticationPayload: payload => {
    const validationResult = PutAuthenticationPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
    return validationResult
  },
  validateDeleteAuthenticationPayload: payload => {
    const validationResult = DeleteAuthenticationPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
    return validationResult
  }
}

module.exports = AuthenticationsValidator

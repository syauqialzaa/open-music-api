const InvariantError = require('../../exceptions/invariant-error')
const { SongPayloadSchema, SongQuerySchema } = require('./schema')

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
    return validationResult
  },
  validateSongQuery: (query) => {
    const validationResult = SongQuerySchema.validate(query)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
    return validationResult
  }
}

module.exports = SongsValidator

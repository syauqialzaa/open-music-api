const InvariantError = require('../../exceptions/invariant-error')
const { PlaylistPayloadSchema, PlaylistSongPayloadSchema } = require('./schema')

const PlaylistsValidator = {
  validatePlaylistPayload: payload => {
    const validationResult = PlaylistPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
    return validationResult
  },
  validatePlaylistSongPayload: payload => {
    const validationResult = PlaylistSongPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
    return validationResult
  }
}

module.exports = PlaylistsValidator

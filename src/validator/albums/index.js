const InvariantError = require('../../exceptions/invariant-error')
const { AlbumPayloadSchema } = require('./schema')

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
    return validationResult
  }
}

module.exports = AlbumsValidator

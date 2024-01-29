const InvariantError = require('../../exceptions/invariant-error')
const { ExportSongsFromPlaylistSchema } = require('./schema')

const ExportsValidator = {
  validateExportSongsFromPlaylistPayload: payload => {
    const validationResult = ExportSongsFromPlaylistSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
    return validationResult
  }
}

module.exports = ExportsValidator

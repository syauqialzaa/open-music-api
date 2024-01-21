const autoBind = require('auto-bind')
const { postSuccessResponse } = require('../../responses')

class ExportsHandler {
  constructor (playlistsService, service, validator) {
    this._playlistsService = playlistsService
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postExportSongsFromPlaylistHandler (request, h) {
    this._validator.validateExportSongsFromPlaylistPayload(request.payload)

    const { id } = request.params
    const { id: credentialId } = request.auth.credentials
    await this._playlistsService.verifyPlaylistOwner(id, credentialId)

    const message = {
      playlistId: id,
      targetEmail: request.payload.targetEmail
    }

    await this._service.sendMessage('export:playlist_songs', JSON.stringify(message))
    return postSuccessResponse(h, 'We are processing your request.', undefined)
  }
}

module.exports = ExportsHandler

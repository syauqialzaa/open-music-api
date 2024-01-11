const autoBind = require('auto-bind')
const { postSuccessResponse, requestSuccessResponse } = require('../../responses')

class CollaborationsHandler {
  constructor (collaborationsService, playlistsService, usersService, validator) {
    this._collaborationsService = collaborationsService
    this._playlistsService = playlistsService
    this._usersService = usersService
    this._validator = validator

    autoBind(this)
  }

  async postCollaborationHandler (request, h) {
    this._validator.validateCollaborationPayload(request.payload)
    const { id: credentialId } = request.auth.credentials
    const { playlistId, userId } = request.payload

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId)
    await this._usersService.getUserById(userId)
    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId)

    return postSuccessResponse(h, 'Collaboration added successfully.', { collaborationId })
  }

  async deleteCollaborationHandler (request, h) {
    this._validator.validateCollaborationPayload(request.payload)
    const { id: credentialId } = request.auth.credentials
    const { playlistId, userId } = request.payload

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId)
    await this._collaborationsService.deleteCollaboration(playlistId, userId)

    return requestSuccessResponse(h, 'Collaboration deleted successfully.', undefined)
  }
}

module.exports = CollaborationsHandler

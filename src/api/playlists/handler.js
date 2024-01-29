const autoBind = require('auto-bind')
const { postSuccessResponse, requestSuccessResponse } = require('../../responses')

class PlaylistsHandler {
  constructor (playlistsService, songsService, validator) {
    this._playlistsService = playlistsService
    this._songsService = songsService
    this._validator = validator

    autoBind(this)
  }

  async postPlaylistHandler (request, h) {
    this._validator.validatePlaylistPayload(request.payload)
    const { name } = request.payload
    const { id: credentialId } = request.auth.credentials

    const playlistId = await this._playlistsService.addPlaylist({ name, owner: credentialId })
    return postSuccessResponse(h, { message: 'Playlist added successfully.', data: { playlistId } })
  }

  async getPlaylistsHandler (request, h) {
    const { id: credentialId } = request.auth.credentials
    const playlists = await this._playlistsService.getPlaylists(credentialId)

    return requestSuccessResponse(h, { data: { playlists } })
  }

  async deletePlaylistByIdHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistOwner(id, credentialId)
    await this._playlistsService.deletePlaylistById(id)

    return requestSuccessResponse(h, { message: 'Playlist deleted successfully.' })
  }

  async postSongToPlaylistHandler (request, h) {
    this._validator.validatePlaylistSongPayload(request.payload)
    const { id } = request.params
    const { songId } = request.payload
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess(id, credentialId)
    await this._songsService.getSongById(songId)
    await this._playlistsService.addActionToPlaylistSongActivities(id, songId, credentialId, 'add')
    const playlistSongId = await this._playlistsService.addSongToPlaylist(id, songId)

    return postSuccessResponse(h, { message: 'Song to Playlist added successfully.', data: { playlistSongId } })
  }

  async getSongsFromPlaylistHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess(id, credentialId)
    const playlist = await this._playlistsService.getSongsFromPlaylist(id)

    return requestSuccessResponse(h, { data: { playlist } })
  }

  async deleteSongFromPlaylistHAndler (request, h) {
    this._validator.validatePlaylistSongPayload(request.payload)
    const { id } = request.params
    const { songId } = request.payload
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess(id, credentialId)
    await this._playlistsService.addActionToPlaylistSongActivities(id, songId, credentialId, 'delete')
    await this._playlistsService.deleteSongFromPlaylist(id, songId)

    return requestSuccessResponse(h, { message: 'Song deleted successfully from playlist.' })
  }

  async getPlaylistSongActivitiesHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._playlistsService.verifyPlaylistAccess(id, credentialId)
    const activities = await this._playlistsService.getPlaylistSongActivities(id)

    return requestSuccessResponse(h, { data: activities })
  }
}

module.exports = PlaylistsHandler

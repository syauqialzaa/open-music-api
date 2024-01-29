const autoBind = require('auto-bind')
const { postSuccessResponse, requestSuccessResponse } = require('../../responses')

class SongsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postSongHandler (request, h) {
    this._validator.validateSongPayload(request.payload)
    const { title, year, performer, genre, duration = null, albumId = null } = request.payload
    const songId = await this._service.addSong({ title, year, performer, genre, duration, albumId })

    return postSuccessResponse(h, { message: 'Song added successfully.', data: { songId } })
  }

  async getSongsHandler (request, h) {
    this._validator.validateSongQuery(request.query)
    const { title = '', performer = '' } = request.query
    const songs = await this._service.getSongs({ title, performer })

    return requestSuccessResponse(h, { data: { songs } })
  }

  async getSongByIdHandler (request, h) {
    const { id } = request.params
    const song = await this._service.getSongById(id)

    return requestSuccessResponse(h, { data: { song } })
  }

  async putSongByIdHandler (request, h) {
    this._validator.validateSongPayload(request.payload)
    const { id } = request.params
    await this._service.editSongById(id, request.payload)

    return requestSuccessResponse(h, { message: 'Song updated successfully.' })
  }

  async deleteSongByIdHandler (request, h) {
    const { id } = request.params
    await this._service.deleteSongById(id)

    return requestSuccessResponse(h, { message: 'Song deleted successfully.' })
  }
}

module.exports = SongsHandler

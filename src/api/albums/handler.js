const autoBind = require('auto-bind')
const { postSuccessResponse, requestSuccessResponse } = require('../../responses')

class AlbumsHandler {
  constructor (service, validator) {
    this._service = service
    this._validator = validator

    autoBind(this)
  }

  async postAlbumHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)

    const { name, year } = request.payload
    const albumId = await this._service.addAlbum({ name, year })

    return postSuccessResponse(h, 'Album added successfully.', { albumId })
  }

  async getAlbumsHandler (h) {
    const albums = await this._service.getAlbums()

    return requestSuccessResponse(h, undefined, { albums })
  }

  async getAlbumByIdHandler (request, h) {
    const { id } = request.params
    const album = await this._service.getAlbumById(id)

    return requestSuccessResponse(h, undefined, { album })
  }

  async putAlbumByIdHandler (request, h) {
    this._validator.validateAlbumPayload(request.payload)
    const { id } = request.params
    await this._service.editAlbumById(id, request.payload)

    return requestSuccessResponse(h, 'Album updated successfully.', undefined)
  }

  async deleteAlbumByIdHandler (request, h) {
    const { id } = request.params
    await this._service.deleteAlbumById(id)

    return requestSuccessResponse(h, 'Album deleted successfully.', undefined)
  }
}

module.exports = AlbumsHandler

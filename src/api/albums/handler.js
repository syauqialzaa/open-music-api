const autoBind = require('auto-bind')
const { postSuccessResponse, requestSuccessResponse } = require('../../responses')
const path = require('path')

class AlbumsHandler {
  constructor (service, albumsValidator, uploadsValidator) {
    this._service = service
    this._albumsValidator = albumsValidator
    this._uploadsValidator = uploadsValidator

    autoBind(this)
  }

  async postAlbumHandler (request, h) {
    this._albumsValidator.validateAlbumPayload(request.payload)

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
    this._albumsValidator.validateAlbumPayload(request.payload)
    const { id } = request.params
    await this._service.editAlbumById(id, request.payload)

    return requestSuccessResponse(h, 'Album updated successfully.', undefined)
  }

  async deleteAlbumByIdHandler (request, h) {
    const { id } = request.params
    await this._service.deleteAlbumById(id)

    return requestSuccessResponse(h, 'Album deleted successfully.', undefined)
  }

  async postCoverAlbumUrlHandler (request, h) {
    const { cover } = request.payload
    const { id } = request.params

    this._uploadsValidator.validateImageHeaders(cover.hapi.headers)
    const fileExt = path.extname(cover.hapi.filename)
    await this._service.addCoverAlbumUrl(cover, id, fileExt)

    return postSuccessResponse(h, 'Cover uploaded successfully.', undefined)
  }

  async postLikesToAlbumHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.addLikesToAlbum({ userId: credentialId, albumId: id })
    return postSuccessResponse(h, 'Album likes added successfully.', undefined)
  }

  async deleteLikesFromAlbumHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.deleteLikesFromAlbum({ userId: credentialId, albumId: id })
    return requestSuccessResponse(h, 'Album likes deleted successfully. ', undefined)
  }

  async getLikesFromAlbumHandler (request, h) {
    const { id } = request.params

    const likes = await this._service.getLikesFromAlbum(id)
    return requestSuccessResponse(h, undefined, { likes })
  }
}

module.exports = AlbumsHandler

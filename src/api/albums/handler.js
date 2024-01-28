const autoBind = require('auto-bind')
const path = require('path')
const {
  postSuccessResponse,
  requestSuccessResponse,
  requestCacheSuccessResponse
} = require('../../responses')

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

    return postSuccessResponse(h, { message: 'Album added successfully.', data: { albumId } })
  }

  async getAlbumsHandler (h) {
    const albums = await this._service.getAlbums()

    return requestSuccessResponse(h, { data: { albums } })
  }

  async getAlbumByIdHandler (request, h) {
    const { id } = request.params
    const album = await this._service.getAlbumById(id)

    return requestSuccessResponse(h, { data: { album } })
  }

  async putAlbumByIdHandler (request, h) {
    this._albumsValidator.validateAlbumPayload(request.payload)
    const { id } = request.params
    await this._service.editAlbumById(id, request.payload)

    return requestSuccessResponse(h, { message: 'Album updated successfully.' })
  }

  async deleteAlbumByIdHandler (request, h) {
    const { id } = request.params
    await this._service.deleteAlbumById(id)

    return requestSuccessResponse(h, { message: 'Album deleted successfully.' })
  }

  async postCoverAlbumUrlHandler (request, h) {
    const { cover } = request.payload
    const { id } = request.params

    this._uploadsValidator.validateImageHeaders(cover.hapi.headers)
    const fileExt = path.extname(cover.hapi.filename)
    await this._service.addCoverAlbumUrl(cover, id, fileExt)

    return postSuccessResponse(h, { message: 'Cover uploaded successfully.' })
  }

  async postLikesToAlbumHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.addLikesToAlbum({ userId: credentialId, albumId: id })
    return postSuccessResponse(h, { message: 'Album likes added successfully.' })
  }

  async deleteLikesFromAlbumHandler (request, h) {
    const { id } = request.params
    const { id: credentialId } = request.auth.credentials

    await this._service.deleteLikesFromAlbum({ userId: credentialId, albumId: id })
    return requestSuccessResponse(h, { message: 'Album likes deleted successfully.' })
  }

  async getLikesFromAlbumHandler (request, h) {
    const { id } = request.params
    const likes = await this._service.getLikesFromAlbum(id)

    const responseFunction = likes.fromCache
      ? requestCacheSuccessResponse
      : requestSuccessResponse

    return responseFunction(h, { data: { likes: likes.numberOfLikes } })
  }
}

module.exports = AlbumsHandler

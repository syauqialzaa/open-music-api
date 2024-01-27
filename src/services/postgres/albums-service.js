const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/invariant-error')
const { mapDBToAlbums, mapDBToAlbumWithSongs } = require('../../utils')
const NotFoundError = require('../../exceptions/not-found-error')
const credentials = require('../../../config/credentials')

class AlbumsService {
  constructor (storageService) {
    this._pool = new Pool()
    this._storageService = storageService
  }

  async addAlbum ({ name, year }) {
    const id = `album-${nanoid(16)}`
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, year, createdAt, updatedAt]
    }

    const result = await this._pool.query(query)
    if (!result.rows[0].id) {
      throw new InvariantError('Album failed to add.')
    }

    return result.rows[0].id
  }

  async getAlbums () {
    const result = await this._pool.query('SELECT * FROM albums')
    return result.rows.map(mapDBToAlbums)
  }

  async getAlbumById (id) {
    const query = {
      text: `
        SELECT
          albums.id,
          albums.name,
          albums.year,
          albums.cover_url,
          songs.id AS song_id,
          songs.title AS song_title,
          songs.performer AS song_performer
        FROM albums
        LEFT JOIN songs ON albums.id = songs.album_id
        WHERE albums.id = $1
      `,
      values: [id]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Album not found.')
    }

    const albumWithSongs = result.rows.reduce((acc, row) => {
      const mappedData = mapDBToAlbumWithSongs(row)

      if (!acc.id) {
        acc = mappedData
      } else if (mappedData.songs.length > 0) {
        acc.songs.push(...mappedData.songs)
      }

      return acc
    }, {})

    return albumWithSongs
  }

  async editAlbumById (id, { name, year }) {
    const updatedAt = new Date().toISOString()
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Album failed to update. Id not found.')
    }
  }

  async deleteAlbumById (id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Album failed to delete. Id not found.')
    }
  }

  async addCoverAlbumUrl (file, albumId, fileExt) {
    const filename = await this._storageService.writeCoverAlbumFile(file, albumId, fileExt)
    if (!filename) {
      throw new InvariantError('Cover failed to write.')
    }

    const coverUrl = `http://${credentials.server.host}:${credentials.server.port}/uploads/images/albums/${filename}`
    const query = {
      text: 'UPDATE albums SET cover_url = $1 WHERE id = $2 RETURNING id',
      values: [coverUrl, albumId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Album failed to update. Id not found.')
    }
  }

  async addLikesToAlbum ({ userId, albumId }) {
    await this.getAlbumById(albumId)
    await this.verifyNewLikesToAlbum(userId, albumId)

    const id = `album-likes-${nanoid(16)}`
    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new InvariantError('Album likes failed to add.')
    }
  }

  async verifyNewLikesToAlbum (userId, albumId) {
    const query = {
      text: 'SELECT user_id, album_id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId]
    }

    const result = await this._pool.query(query)
    if (result.rowCount > 0) {
      throw new InvariantError('Failed to add likes. Album already liked.')
    }
  }

  async deleteLikesFromAlbum ({ userId, albumId }) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Album likes failed to delete. Id not found.')
    }
  }

  async getLikesFromAlbum (albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE album_id = $1',
      values: [albumId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Album likes not found.')
    }

    return result.rowCount
  }
}

module.exports = AlbumsService

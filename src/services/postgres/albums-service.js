const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/invariant-error')
const { mapDBToAlbums } = require('../../utils')
const NotFoundError = require('../../exceptions/not-found-error')

class AlbumsService {
  constructor () {
    this._pool = new Pool()
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
    const albumQuery = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id]
    }

    const songQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE album_id = $1 ',
      values: [id]
    }

    // run both queries parallelly using Promise.all
    const [albumResult, songsResult] = await Promise.all([
      this._pool.query(albumQuery),
      this._pool.query(songQuery)
    ])

    if (!albumResult.rows.length) {
      throw new NotFoundError('Album not found.')
    }

    const albumData = albumResult.rows[0]
    const songsData = songsResult.rows

    const albumWithSongs = {
      id: albumData.id,
      name: albumData.name,
      year: albumData.year,
      songs: songsData
    }

    return albumWithSongs
  }

  async editAlbumById (id, { name, year }) {
    const updatedAt = new Date().toISOString()
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2, updated_at = $3 WHERE id = $4 RETURNING id',
      values: [name, year, updatedAt, id]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Album failed to update. Id not found.')
    }
  }

  async deleteAlbumById (id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Album failed to delete. Id not found.')
    }
  }
}

module.exports = AlbumsService

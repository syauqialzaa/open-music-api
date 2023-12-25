const { Pool } = require('pg')
const { nanoid } = require('nanoid')
const InvariantError = require('../../exceptions/invariant-error')
const { mapDBToSongs } = require('../../utils')
const NotFoundError = require('../../exceptions/not-found-error')

class SongsService {
  constructor () {
    this._pool = new Pool()
  }

  async addSong ({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${nanoid(16)}`
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId, createdAt, updatedAt]
    }

    const result = await this._pool.query(query)
    if (!result.rows[0].id) {
      throw new InvariantError('Song failed to add.')
    }

    return result.rows[0].id
  }

  async getSongs ({ title, performer }) {
    const query = 'SELECT id, title, performer FROM songs'
    const result = await this._pool.query(query)
    let filteredSongs = result.rows

    if (title !== '') {
      filteredSongs = filteredSongs.filter((song) => song.title.toLowerCase().includes(title.toLowerCase()))
    }

    if (performer !== '') {
      filteredSongs = filteredSongs.filter((song) => song.performer.toLowerCase().includes(performer.toLowerCase()))
    }

    return filteredSongs
  }

  async getSongById (id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Song not found.')
    }

    return result.rows.map(mapDBToSongs)[0]
  }

  async editSongById (id, { title, year, performer, genre, duration, albumId }) {
    const updatedAt = new Date().toISOString()
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6, updated_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, performer, genre, duration, albumId, updatedAt, id]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Song failed to update. Id not found.')
    }
  }

  async deleteSongById (id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)
    if (!result.rows.length) {
      throw new NotFoundError('Song failed to delete. Id not found.')
    }
  }
}

module.exports = SongsService

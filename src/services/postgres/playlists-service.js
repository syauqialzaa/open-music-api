const { nanoid } = require('nanoid')
const { Pool } = require('pg')
const InvariantError = require('../../exceptions/invariant-error')
const { mapDBToPlaylists, mapDBToSongsFromPlaylist, mapDBToPlaylistSongActivities } = require('../../utils')
const NotFoundError = require('../../exceptions/not-found-error')
const AuthorizationError = require('../../exceptions/authorization-error')

class PlaylistsService {
  constructor (collaborationsService) {
    this._pool = new Pool()
    this._collaborationsService = collaborationsService
  }

  async addPlaylist ({ name, owner }) {
    const id = `playlist-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner]
    }

    const result = await this._pool.query(query)
    if (!result.rows[0].id) {
      throw new InvariantError('Playlist failed to add.')
    }

    return result.rows[0].id
  }

  async getPlaylists (owner) {
    const query = {
      text: `
      SELECT
        playlists.id,
        playlists.name,
        users.username
      FROM playlists
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
      `,
      values: [owner]
    }

    const result = await this._pool.query(query)
    return result.rows.map(mapDBToPlaylists)
  }

  async deletePlaylistById (id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Playlist failed to delete. Id not found.')
    }
  }

  async addSongToPlaylist (playlistId, songId) {
    const id = `playlist_song-${nanoid(16)}`

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId]
    }

    const result = await this._pool.query(query)
    if (!result.rows[0].id) {
      throw new InvariantError('Song failed to add to playlist.')
    }

    return result.rows[0].id
  }

  async getSongsFromPlaylist (playlistId) {
    const query = {
      text: `
        SELECT
          playlists.id,
          playlists.name,
          users.username,
          songs.id AS song_id,
          songs.title AS song_title,
          songs.performer AS song_performer
        FROM playlists
        JOIN playlist_songs ON playlists.id = playlist_songs.playlist_id
        JOIN songs ON playlist_songs.song_id = songs.id
        JOIN users ON playlists.owner = users.id
        WHERE playlists.id = $1
      `,
      values: [playlistId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Playlist not found.')
    }

    const songsFromPlaylist = result.rows.reduce((acc, row) => {
      const mappedData = mapDBToSongsFromPlaylist(row)

      if (!acc.id) {
        acc = mappedData
      } else if (mappedData.songs.length > 0) {
        acc.songs.push(...mappedData.songs)
      }

      return acc
    }, {})

    return songsFromPlaylist
  }

  async deleteSongFromPlaylist (playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new InvariantError('Song failed to delete from playlist.')
    }
  }

  async verifyPlaylistOwner (id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Playlist not found.')
    }

    const playlist = result.rows[0]
    if (playlist.owner !== owner) {
      throw new AuthorizationError('You are not allowed to access this resource.')
    }
  }

  async verifyPlaylistAccess (playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      try {
        await this._collaborationsService.verifyCollaborator(playlistId, userId)
      } catch {
        throw error
      }
    }
  }

  async addActionToPlaylistSongActivities (playlistId, songId, userId, action) {
    const id = `activity-${nanoid(16)}`
    const time = new Date().toISOString()

    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time]
    }

    const result = await this._pool.query(query)
    if (!result.rows[0]) {
      throw new InvariantError('Playlist song activity failed to add.')
    }
  }

  async getPlaylistSongActivities (playlistId) {
    const query = {
      text: `
        SELECT
          playlist_song_activities.playlist_id,
          users.username,
          songs.title,
          playlist_song_activities.action,
          playlist_song_activities.time
        FROM playlist_song_activities
        JOIN users ON playlist_song_activities.user_id = users.id
        JOIN songs ON playlist_song_activities.song_id = songs.id
        WHERE playlist_song_activities.playlist_id = $1
      `,
      values: [playlistId]
    }

    const result = await this._pool.query(query)
    if (!result.rowCount) {
      throw new NotFoundError('Playlist not found.')
    }

    return mapDBToPlaylistSongActivities(result.rows)
  }
}

module.exports = PlaylistsService

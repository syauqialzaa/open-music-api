/* eslint-disable camelcase */

const mapDBToAlbums = ({
  id,
  name,
  year
}) => ({
  id,
  name,
  year
})

const mapDBToAlbumWithSongs = (row) => {
  const { id, name, year, song_id, song_title, song_performer } = row

  return {
    id,
    name,
    year,
    songs: song_id
      ? [{ id: song_id, title: song_title, performer: song_performer }]
      : []
  }
}

const mapDBToSongs = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id
})

const mapDBToPlaylists = ({
  id,
  name,
  username
}) => ({
  id,
  name,
  username
})

const mapDBToSongsFromPlaylist = (row) => {
  const { id, name, username, song_id, song_title, song_performer } = row

  return {
    id,
    name,
    username,
    songs: song_id
      ? [{ id: song_id, title: song_title, performer: song_performer }]
      : []
  }
}

module.exports = { mapDBToAlbums, mapDBToSongs, mapDBToAlbumWithSongs, mapDBToPlaylists, mapDBToSongsFromPlaylist }

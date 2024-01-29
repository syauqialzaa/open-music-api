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
  const { id, name, year, cover_url, song_id, song_title, song_performer } = row

  return {
    id,
    name,
    year,
    coverUrl: cover_url,
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

const mapDBToPlaylistSongActivities = (row) => {
  const activities = row.map((activity) => ({
    username: activity.username,
    title: activity.title,
    action: activity.action,
    time: activity.time
  }))

  return {
    playlistId: row[0].playlist_id,
    activities
  }
}

module.exports = {
  mapDBToAlbums,
  mapDBToSongs,
  mapDBToAlbumWithSongs,
  mapDBToPlaylists,
  mapDBToSongsFromPlaylist,
  mapDBToPlaylistSongActivities
}

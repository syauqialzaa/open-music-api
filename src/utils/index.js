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

module.exports = { mapDBToAlbums, mapDBToSongs }

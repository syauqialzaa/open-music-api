const albums = require('./api/albums')
const songs = require('./api/songs')
const AlbumsService = require('./services/postgres/albums-service')
const SongsService = require('./services/postgres/songs-service')
const AlbumsValidator = require('./validator/albums')
const SongsValidator = require('./validator/songs')

const ServerPlugins = async server => {
  const albumsService = new AlbumsService()
  const songsService = new SongsService()

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator
      }
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator
      }
    }
  ])
}

module.exports = ServerPlugins

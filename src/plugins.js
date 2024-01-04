// albums
const albums = require('./api/albums')
const AlbumsService = require('./services/postgres/albums-service')
const AlbumsValidator = require('./validator/albums')

// songs
const songs = require('./api/songs')
const SongsService = require('./services/postgres/songs-service')
const SongsValidator = require('./validator/songs')

// users
const users = require('./api/users')
const UsersService = require('./services/postgres/users-service')
const UsersValidator = require('./validator/users')

// authentications
const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/postgres/authentications-service')
const TokenManager = require('./token/token-manager')
const AuthenticationsValidator = require('./validator/authentications')

const ServerPlugins = async server => {
  const albumsService = new AlbumsService()
  const songsService = new SongsService()
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()

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
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator
      }
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator
      }
    }
  ])
}

module.exports = ServerPlugins

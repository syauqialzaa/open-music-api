const Jwt = require('@hapi/jwt')
const credentials = require('../config/credentials')

const albums = require('./api/albums')
const AlbumsService = require('./services/postgres/albums-service')
const AlbumsValidator = require('./validator/albums')

const songs = require('./api/songs')
const SongsService = require('./services/postgres/songs-service')
const SongsValidator = require('./validator/songs')

const users = require('./api/users')
const UsersService = require('./services/postgres/users-service')
const UsersValidator = require('./validator/users')

const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/postgres/authentications-service')
const TokenManager = require('./token/token-manager')
const AuthenticationsValidator = require('./validator/authentications')

const collaborations = require('./api/collaborations')
const CollaborationsService = require('./services/postgres/collaborations-service')
const CollaborationsValidator = require('./validator/collaborations')

const playlists = require('./api/playlists')
const PlaylistsService = require('./services/postgres/playlists-service')
const PlaylistsValidator = require('./validator/playlists')

const _exports = require('./api/exports')
const ProducerService = require('./services/rabbitmq/producer-service')
const ExportsValidator = require('./validator/exports')

const ServerPlugins = async server => {
  const albumsService = new AlbumsService()
  const songsService = new SongsService()
  const usersService = new UsersService()
  const authenticationsService = new AuthenticationsService()
  const collaborationsService = new CollaborationsService()
  const playlistsService = new PlaylistsService(collaborationsService)

  await server.register([
    {
      plugin: Jwt
    }
  ])

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: credentials.jwt.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: credentials.jwt.accessTokenAge
    },
    validate: artifacts => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id
      }
    })
  })

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
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator
      }
    },
    {
      plugin: playlists,
      options: {
        playlistsService,
        songsService,
        validator: PlaylistsValidator
      }
    },
    {
      plugin: _exports,
      options: {
        playlistsService,
        service: ProducerService,
        validator: ExportsValidator
      }
    }
  ])
}

module.exports = ServerPlugins

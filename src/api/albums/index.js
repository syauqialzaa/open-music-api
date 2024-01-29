const AlbumsHandler = require('./handler')
const routes = require('./routes')

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { service, albumsValidator, uploadsValidator }) => {
    const albumsHandler = new AlbumsHandler(service, albumsValidator, uploadsValidator)
    server.route(routes(albumsHandler))
  }
}

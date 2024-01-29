const routes = handler => [
  {
    method: 'GET',
    path: '/uploads/{param*}',
    handler: handler.getUploadImageHandler
  }
]

module.exports = routes

const autoBind = require('auto-bind')
const path = require('path')

class UploadsHandler {
  constructor () {
    autoBind(this)
  }

  async getUploadImageHandler (request, h) {
    const { param } = request.params
    const filePath = path.resolve(__dirname, 'files', param)

    return h.file(filePath)
  }
}

module.exports = UploadsHandler

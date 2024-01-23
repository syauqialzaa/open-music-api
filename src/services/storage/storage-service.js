const fs = require('fs')

class StorageService {
  constructor (folder) {
    this._folder = folder
    const albumsFolder = `${this._folder}/albums`

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true })
    }

    if (!fs.existsSync(albumsFolder)) {
      fs.mkdirSync(albumsFolder, { recursive: true })
    }
  }

  writeCoverAlbumFile (file, albumId, fileExt) {
    const filename = +new Date() + '_cover_' + albumId + fileExt
    const path = `${this._folder}/albums/${filename}`
    const fileStream = fs.createWriteStream(path)

    return new Promise((resolve, reject) => {
      fileStream.on('error', error => reject(error))
      file.pipe(fileStream)
      file.on('end', () => resolve(filename))
    })
  }
}

module.exports = StorageService

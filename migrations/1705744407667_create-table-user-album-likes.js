exports.up = pgm => {
  pgm.createTable('user_album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    user_id: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true
    },
    album_id: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('user_album_likes')
}

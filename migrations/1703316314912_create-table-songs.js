/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true
    },
    title: {
      type: 'TEXT',
      notNull: true
    },
    year: {
      type: 'INT',
      notNull: true
    },
    performer: {
      type: 'TEXT',
      notNull: true
    },
    genre: {
      type: 'TEXT',
      notNull: false
    },
    duration: {
      type: 'INT',
      notNull: false
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: false
    },
    created_at: {
      type: 'TEXT',
      notNull: true
    },
    updated_ta: {
      type: 'TEXT',
      notNull: true
    }
  })
}

exports.down = pgm => {}

const Joi = require('joi')

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(2023).required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number(),
  albumId: Joi.string()
})

const SongQuerySchema = Joi.object({
  title: Joi.string(),
  performer: Joi.string()
})

module.exports = { SongPayloadSchema, SongQuerySchema }

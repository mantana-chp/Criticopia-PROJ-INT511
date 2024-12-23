import vine, { SimpleMessagesProvider } from '@vinejs/vine'

const schema = vine.object({
  title: vine.string(),
  primaryImage: vine.string(),
  description: vine.string(),
  cast: vine.string(),
  release_date: vine.date(),
  avg_rating: vine.number(),
  runtimeMinutes: vine.number(),
  type: vine.string(),
})

const messages = { required: 'The {{ field }} is required.' }

export const createMovieValidator = vine.compile(schema)
createMovieValidator.messagesProvider = new SimpleMessagesProvider(messages)

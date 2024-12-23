import vine, { SimpleMessagesProvider } from '@vinejs/vine'

// Define the validation schema
const schema = vine.object({
  username: vine
    .string()
    .minLength(6)
    .unique(async (movie, value) => {
      const findUser = await movie.from('users').where('username', value).first()
      return !findUser
    }),
  email: vine
    .string()
    .email()
    .unique(async (movie, value) => {
      const findUser = await movie.from('users').where('email', value).first()
      return !findUser
    }),
  password: vine.string().minLength(6).confirmed({ confirmationField: 'confirmPassword' }),
  confirmPassword: vine.string().minLength(6).confirmed({ confirmationField: 'password' }),
})

// Set up custom messages
const messages = {
  'required': 'The {{ field }} is required.',
  'minLength': 'The {{ field }} must have at least 6 length.',
  'confirmed': 'The password is not matched with Confirm Password.',
  'username.unique': 'The username is already used.',
  'email': 'The email format is invalid.',
  'email.unique': 'The email is already in use.',
}
// Compile the validator
export const registerUserValidator = vine.compile(schema)
registerUserValidator.messagesProvider = new SimpleMessagesProvider(messages)

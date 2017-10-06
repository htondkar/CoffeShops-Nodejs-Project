const mongoose = require('mongoose')
const md5 = require('md5')
const validator = require('validator')
const mongoDbErrorHandler = require('mongoose-mongodb-errors')
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please enter an email'
  },
  name: { type: String, required: 'Please enter your name', trim: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date
})

UserSchema.virtual('gravatar').get(function() {
  const hash = md5(this.email)
  return `https://gravatar.com/avatar/${hash}?s=200`
})

// exposes a .register method in a model level
UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' })
// show pretty errors
UserSchema.plugin(mongoDbErrorHandler)

module.exports = mongoose.model('User', UserSchema)

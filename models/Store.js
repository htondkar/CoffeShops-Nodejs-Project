const mongoose = require('mongoose')
const slug = require('slugs')

mongoose.Promise = global.Promise

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'You must specify a name'
  },
  slug: String,
  description: { type: String, trim: 'true' },
  tags: [String]
})

storeSchema.pre('save', function(next) {
  // add slug to store
  if (this.isModified('name')) {
    this.slug = slug(this.name)
    next()
  } else {
    // just skip
    next()
    return
  }
})

module.exports = mongoose.model('Store', storeSchema)

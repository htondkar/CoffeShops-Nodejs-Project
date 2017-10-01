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
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number],
    address: {
      type: String,
      required: 'you must provide an address'
    }
  },
  photo: String
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

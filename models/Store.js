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

storeSchema.pre('save', async function(next) {
  // add slug to store only if the name is new
  if (this.isModified('name')) {
    this.slug = slug(this.name)
    // check if we've had this slug before
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
    // because when this function runs we dont have a Store yet
    // we call the constructor of it
    const stores = await this.constructor.find({ slug: slugRegEx })
    if (stores.length > 0) {
      this.slug = `${this.slug}-${stores.length + 1}`
    }
    next()
  } else {
    next()
    return
  }
})

module.exports = mongoose.model('Store', storeSchema)

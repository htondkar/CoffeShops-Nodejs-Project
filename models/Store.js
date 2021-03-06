const mongoose = require('mongoose')
const slug = require('slugs')
const dompurify = require('dompurify')

mongoose.Promise = global.Promise

const storeSchema = new mongoose.Schema(
  {
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
    photo: String,
    author: {
      type: mongoose.Schema.ObjectId, // PascalCase
      ref: 'User',
      required: 'You must supply an author'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// define indexes
storeSchema.index({
  name: 'text',
  description: 'text'
})

// define indexes
storeSchema.index({
  location: {
    coordinates: '2dsphere'
  }
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

// to prevent XSS
storeSchema.pre('save', function() {
  this.name = dompurify(this.name)
  this.description = dompurify(this.description)
})

storeSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ])
}

// this method is specific to mongoose
// cant be used with aggregation
storeSchema.virtual('reviews', {
  localField: '_id', // id of this store
  foreignField: 'store', // should match the store property
  ref: 'Review' // of the Review model
})

storeSchema.statics.getTopStores = function() {
  return this.aggregate([
    {
      $lookup: {
        from: 'reviews', // "Review" => "reviews" this is done by mongoDB!
        localField: '_id',
        foreignField: 'store',
        as: 'reviews' // what to call reviews in the results
      }
    },
    {
      $match: {
        'reviews.1': { $exists: true } // review.1 accessing the second item in reviews
      }
    },
    {
      $project: {
        photo: '$$ROOT.photo',
        name: '$$ROOT.name',
        reviews: '$$ROOT.reviews',
        slug: '$$ROOT.slug',
        averageRating: { $avg: '$reviews.rating' }
      }
    },
    {
      $sort: {
        averageRating: -1
      }
    },
    {
      $limit: 10
    }
  ])
}

module.exports = mongoose.model('Store', storeSchema)

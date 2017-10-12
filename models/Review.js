const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const reviewSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  },
  store: {
    type: mongoose.Schema.ObjectId,
    ref: 'Store',
    required: 'You must supply an author'
  },
  created: { type: Date, default: Date.now },
  text: { type: String, required: 'You must supply a text' },
  rating: { type: Number, max: 5, min: 1 }
})

function populateAuthor(next) {
  this.populate('author')
  next()
}

reviewSchema.pre('find', populateAuthor)
reviewSchema.pre('findOne', populateAuthor)

module.exports = mongoose.model('Review', reviewSchema)

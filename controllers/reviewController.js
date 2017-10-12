const mongoose = require('mongoose')

const Review = mongoose.model('Review')

exports.addReview = async (req, res) => {
  req.body.author = req.user._id
  req.body.created = Date.now()
  req.body.store = req.params.storeId
  const review = new Review(req.body)
  await review.save()
  res.redirect(`back`)
}

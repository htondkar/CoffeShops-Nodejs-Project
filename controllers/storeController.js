const mongoose = require('mongoose')
const Store = mongoose.model('Store')

exports.homePage = (req, res) => {
  res.render('index', { title: 'home' })
}

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add a store' })
}

exports.createStore = async (req, res) => {
  await new Store(req.body).save()
  req.flash('success', 'Successfully added the store')
  res.redirect('/')
}

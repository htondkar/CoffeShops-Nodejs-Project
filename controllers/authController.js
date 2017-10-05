const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed to login.',
  successRedirect: '/',
  successFlash: 'You are logged in now'
})

exports.logout = (req, res) => {
  req.logout()
  req.flash('success', 'Your are logged out')
  res.redirect('/')
}

exports.isLoggedIn = (req, res, next) => {
  // comes from passport
  if (req.isAuthenticated()) {
    next()
    return
  } else {
    req.flash('error', 'You must login')
    res.redirect('/')
  }
}

exports.account = (req, res, next) => {
  res.render('account', { title: 'Account' })
}
exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  }
  const user = await User.findOneAndUpdate(
    { _id: req.user._id }, // provided by passport
    { $set: updates },
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )
  req.flash('success', 'Your successfully updated your profile')
  res.redirect('back')
}

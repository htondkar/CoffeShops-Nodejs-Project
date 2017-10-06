const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const crypto = require('crypto')
const promisify = require('es6-promisify')

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

exports.forgotPassword = async (req, res) => {
  const hostURL = req.headers.host
  // check if the email exists
  const user = await User.findOne({ email: req.body.email })
  if (user) {
    // set a password reset token + expire date
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex')
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60 // one hour
    await user.save()

    // send email
    const resetURL = `http://${hostURL}/account/reset/${user.resetPasswordToken}`

    req.flash(
      'success',
      'You have been emailed with a password reset link' + ' ' + resetURL
    )
    res.redirect('/login')
  } else {
    req.flash('error', 'That email does not exist')
    res.redirect('/login')
  }
}

exports.validatePasswords = (req, res, next) => {
  req.checkBody('password', 'password can not be empty').notEmpty()
  req
    .checkBody('password_confirm', 'password confirmation can not be empty')
    .notEmpty()
  req
    .checkBody('password_confirm', 'passwords should match')
    .equals(req.body.password)

  const errors = req.validationErrors()
  if (errors) {
    req.flash('error', errors.map(err => err.msg))
    res.redirect('back')
    return
  } else {
    next()
  }
}

exports.updatePassword = async (req, res) => {
  const resetToken = req.params.resetToken
  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordExpires: { $gt: Date.now() }
  })
  if (user) {
    // use passport methods
    const setPassword = promisify(user.setPassword, user)
    await setPassword(req.body.password)
    // clean token and expire fields
    user.resetPasswordExpires = undefined
    user.resetPasswordToken = undefined
    const updatedUser = await user.save()
    //log user in with the new password
    // login method is provided by passport
    await req.login(updatedUser)
    req.flash('success', 'Your password is reset!')
    res.redirect('/')
  } else {
    req.flash('error', 'Your token is expired!')
    res.redirect('/login')
  }
}

exports.resetPassword = async (req, res) => {
  const resetToken = req.params.resetToken
  if (resetToken) {
    // if they have the token and it is not expired
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() }
    })
    if (user) {
      // show to new password form
      res.render('resetForm', { title: 'Rest Password' })
    } else {
      req.flash('error', 'Your token is expired!')
      res.redirect('/login')
    }
  } else {
    res.redirect('/')
  }
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

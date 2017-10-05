const mongoose = require('mongoose')

exports.loginForm = function(req, res) {
  res.render('login', { title: 'Login' })
}

exports.registerForm = function(req, res) {
  res.render('register', { title: 'Register' })
}

exports.validateRegister = (req, res, next) => {
  req.checkBody('name', 'You must provide a name').notEmpty()
  req.sanitizeBody('name')
  req
    .checkBody('email', 'You must provide an email address')
    .notEmpty()
    .isEmail()
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  })
  req.checkBody('password', 'Password can not be blank').notEmpty()
  req
    .checkBody('password_confirm', 'Confirm password can not be blank')
    .notEmpty()
  req.checkBody('password_confirm', 'passwords should match').equals('password')
  const errors = req.validationErrors()
  if (true) {
    req.flash('error', errors.map(err => err.msg))
    res.render('register', {
      title: 'register',
      body: req.body,
      flashes: req.flash()
    })
    return
  } else {
    next()
  }
}

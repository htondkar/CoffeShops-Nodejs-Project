const mongoose = require('mongoose')
const promisify = require('es6-promisify')
const User = mongoose.model('User')

exports.loginForm = function(req, res) {
  res.render('login', { title: 'Login' })
}

exports.registerForm = function(req, res) {
  res.render('register', { title: 'Register' })
}

exports.register = async (req, res, next) => {
  const user = await new User({ email: req.body.email, name: req.body.name })
  // promisify the register provided by passport-local-mongoose
  const promisedRegister = promisify(User.register, User) // second argument is context
  // use the promisified method provided by passport-local-mongoose
  await promisedRegister(user, req.body.password)
  next()
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
  req
    .checkBody('password_confirm', 'Passwords should match')
    .equals(req.body.password)

  const errors = req.validationErrors()

  if (errors) {
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

exports.heartedPage = async (req, res) => {
  const user = req.user
  if (!user) {
    res.redirect('/')
    return
  }
  const userWithHeartedStores = await User.findOne({ _id: user._id }).populate(
    'hearts'
  )
  res.render('heartedPage', {
    title: 'Hearted Stores',
    stores: userWithHeartedStores.hearts
  })
}

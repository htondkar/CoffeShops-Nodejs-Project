const passport = require('passport')
const mongoose = require('mongoose')

const User = mongoose.model('User')

// methods on the User model are i guess provided by passport-local-mongoose package
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const mongoose = require('mongoose')

exports.loginForm = function(req, res) {
  res.render('login', {title: 'Login'})
}  
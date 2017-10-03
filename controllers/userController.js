const mongoose = require('mongoose')

exports.loginForm = function(req, res) {
  res.render('login', {title: 'Login'})
}  

exports.createUser = function(req, res) {
  res.send('works')
}  
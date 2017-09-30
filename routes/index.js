const express = require('express')
const router = express.Router()
const { homePage, addStore } = require('../controllers/stroeController.js')

router.get('/', homePage)
router.get('/add', addStore)

module.exports = router

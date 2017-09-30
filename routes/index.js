const express = require('express')
const router = express.Router()
const {
  homePage,
  addStore,
  createStore
} = require('../controllers/storeController')
const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', homePage)
router.get('/add', addStore)
router.post('/add', catchErrors(createStore))

module.exports = router

const express = require('express')
const router = express.Router()
const {
  getStores,
  addStore,
  createStore,
  editStore,
  updateStore,
  upload,
  resize
} = require('../controllers/storeController')
const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', catchErrors(getStores))
router.get('/stores', catchErrors(getStores))
router.get('/add', addStore)
router.post('/add',upload, catchErrors(resize), catchErrors(createStore))
router.post('/add/:storeId', catchErrors(updateStore))
router.get('/stores/:storeId/edit', catchErrors(editStore))

module.exports = router

const express = require('express')
const router = express.Router()
const {
  getStores,
  addStore,
  createStore,
  editStore,
  updateStore,
  upload,
  resize,
  getStoreBySlug,
  getStoresByTag
} = require('../controllers/storeController')
const { loginForm, createUser } = require('../controllers/userController')
const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', catchErrors(getStores))

router.get('/stores', catchErrors(getStores))

router.get('/add', addStore)

router.post('/add', upload, catchErrors(resize), catchErrors(createStore))

router.post(
  '/add/:storeId',
  upload,
  catchErrors(resize),
  catchErrors(updateStore)
)

router.get('/stores/:storeId/edit', catchErrors(editStore))
router.get('/stores/:slug', catchErrors(getStoreBySlug))

router.get('/tags', catchErrors(getStoresByTag))
router.get('/tags/:tag', catchErrors(getStoresByTag))

router.get('/login', loginForm)
router.post('/login', createUser)

module.exports = router

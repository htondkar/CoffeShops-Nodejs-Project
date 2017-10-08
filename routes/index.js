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
  getStoresByTag,
  searchStores,
  mapStores,
  mapPage
} = require('../controllers/storeController')

const {
  loginForm,
  createUser,
  registerForm,
  validateRegister,
  register
} = require('../controllers/userController')

const {
  login,
  logout,
  isLoggedIn,
  account,
  updateAccount,
  forgotPassword,
  resetPassword,
  validatePasswords,
  updatePassword
} = require('../controllers/authController')

const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', catchErrors(getStores))

router.get('/stores', catchErrors(getStores))

router.get('/add', isLoggedIn, addStore)

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
router.post('/login', login)

router.get('/logout', logout)

router.get('/register', registerForm)

// 1) validate form
// 2) create the account
// 3) log the user in
router.post('/register', validateRegister, register, login)

router.get('/account', isLoggedIn, account)
router.post('/account', catchErrors(updateAccount))

router.post('/account/forgot', catchErrors(forgotPassword))
router.get('/account/reset/:resetToken', catchErrors(resetPassword))
router.post(
  '/account/reset/:resetToken',
  validatePasswords,
  catchErrors(updatePassword)
)

// API
router.get('/api/search', catchErrors(searchStores))
router.get('/api/stores/near', catchErrors(mapStores))


router.get('/map', mapPage)

module.exports = router

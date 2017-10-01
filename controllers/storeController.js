const mongoose = require('mongoose')
const multer = require('multer')
const jimp = require('jimp')
const uuid = require('uuid')

const Store = mongoose.model('Store')
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
    if (file.mimetype.startsWith('image/')) {
      next(null, true)
    } else {
      next({ message: 'file type is not valid' })
    }
  }
}

exports.getStores = async (req, res) => {
  const stores = await Store.find() // all of them
  res.render('stores', { title: 'Stores', stores })
}

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add a store' })
}

exports.createStore = async (req, res) => {
  await new Store(req.body).save()
  req.flash('success', 'Successfully added the store')
  res.redirect('/')
}

exports.editStore = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.storeId })
  res.render('editStore', { title: 'Edit Store', store })
}

exports.updateStore = async (req, res) => {
  // to make sure db doesn't throw away type
  req.body.location.type = 'body'
  const store = await Store.findOneAndUpdate(
    { _id: req.params.storeId },
    req.body,
    { new: true, runValidators: true }
  ).exec()
  req.flash('success', 'Update was Successful')
  res.redirect(`/stores/${store._id}/edit`)
}

exports.upload = multer(multerOptions).single('photo')

exports.resize = async (req, res, next) => {
  if (!req.file) {
    next()
  } else {
    // to save the name to database
    const extension = req.file.mimetype.split('/')[1]
    req.body.photo = uuid.v4() + extension

    const photo = await jimp.read(req.file.buffer)
    await photo.resize(800, jimp.AUTO)
    await photo.write(`./public/uploads/${req.body.photo}`)
    next(null)
  }
}

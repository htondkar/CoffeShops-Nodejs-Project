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
  req.body.author = req.user._id // provided by passport
  await new Store(req.body).save()
  req.flash('success', 'Successfully added the store')
  res.redirect('/')
}

const confirmOwner = (store, user) => {
  if (!store.author.equals(user._id)) {
    throw Error('You must own a store to be able to edit it')
  }
}

exports.editStore = async (req, res) => {
  const store = await Store.findOne({ _id: req.params.storeId })
  confirmOwner(store, req.user) // might throw
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
    req.body.photo = uuid.v4() + '.' + extension

    const photo = await jimp.read(req.file.buffer)
    await photo.resize(800, jimp.AUTO)
    await photo.write(`./public/uploads/${req.body.photo}`)
    next(null)
  }
}

exports.getStoreBySlug = async (req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug }).populate(
    'author'
  )
  if (!store) {
    next()
    return
  }
  res.render('store', { title: store.name, store })
}

exports.getStoresByTag = async function(req, res) {
  const currentTag = req.params.tag
  const tagsPromise = Store.getTagsList()
  const storesWithCurrentTagPromise = Store.find({
    tags: currentTag || { $exists: true }
  })
  const [tags, storesWithCurrentTag] = await Promise.all([
    tagsPromise,
    storesWithCurrentTagPromise
  ])
  res.render('tags', { tags, title: 'Tags', currentTag, storesWithCurrentTag })
}

exports.searchStores = async (req, res) => {
  const stores = await Store.find(
    {
      // use compound text indexes from mongoDB
      $text: {
        $search: req.query.q
      }
    },
    // project a score key to result
    {
      score: { $meta: 'textScore' }
    }
  )
    .sort({
      // sort base on the projected score field
      score: { $meta: 'textScore' }
    })
    .limit(5)

  res.json(stores)
}

exports.mapStores = async (req, res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat)
  const query = {
    location: {
      $near: {
        $geometry: { 
          type: 'Point',
          coordinates
        },
        $maxDistance: 10000 // 10km
      }
    }
  }

  const stores = await Store.find(query)
    .select('name description location slug photo')
    .limit(10)

  res.json(stores)
}

exports.mapPage = async (req, res) => {
  res.render('map', { title: 'Map' })
}

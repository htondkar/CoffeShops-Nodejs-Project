exports.homePage = (req, res) => {
  res.render('index', { title: 'home' })
}

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' })
}

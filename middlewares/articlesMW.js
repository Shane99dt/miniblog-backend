const articlesTable = require('../articles.json')

const articleExists = (req, res, next) => {
  const article = articlesTable.find(art => art.slug === req.params.slugArticle)
  const articleIndex = articlesTable.findIndex(art => art.slug === req.params.slugArticle)

  if(article){
    req.article = article
    req.articleIndex = articleIndex
    next()
  }else{
    res.status(400).json("Article doesn't exists")
  }
}

module.exports = { articleExists }
const fs = require('fs')
const slugify = require('slugify')

const articleExists = (req, res, next) => {

  fs.readFile('./articles.json', (err, data) => {
    if(err){
      res.json(err)
      return
    }

    const dataJsoned = JSON.parse(data.toString())
    const article = dataJsoned.find(art => art.slug === req.params.slugArticle)
    const articleIndex = dataJsoned.findIndex(art => art.slug === req.params.slugArticle)

    if(article){
      req.article = article
      req.articleIndex = articleIndex
      next()
    }else{
      res.status(404).json("Article doesn't exists")
    }
  })
}

const articleNotExist = (req, res, next) => {

  fs.readFile('./articles.json', (err, data) => {
    if(err){
      res.json(err)
      return
    }

    if(!req.body.title){
      res.status(400).json('title doesnt exists')
      return
    }

    const slugified = slugify(req.body.title, {lower: true})
    const dataJsoned = JSON.parse(data.toString())
    const article = dataJsoned.find(art => art.slug === slugified)

    if(!article){
      next()
    }else{
      res.status(409).json("Article already exists")
    }
  })
}

const categoryExists = (req, res, next) => {

  fs.readFile('./categories.json', (err, data) => {
    if(err){
      res.json(err)
      return
    }
    const dataJsoned = JSON.parse(data.toString())
    const category = dataJsoned.find(category => category.slug === req.params.slug)

    if(category){
      req.category = category
      next()
    }else{
      res.status(404).json("Category doesn't exists")
    }
  })
}



module.exports = { articleExists, articleNotExist, categoryExists }
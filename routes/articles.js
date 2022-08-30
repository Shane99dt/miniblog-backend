const express = require('express')
const app = express()
const fs = require('fs')
// const { categoryExists } = require('../middlewares/categoriesMW')
const { articleExists, articleNotExist, categoryExists } = require('../middlewares/articlesMW')
const slugify = require('slugify')
const { body, validationResult } = require('express-validator')
const moment = require('moment')

// view all articles
app.get('/', (req, res) => {
  fs.readFile('./articles.json', (err, data) => {
    if(err){
      res.json(err)
      return
    }
    const stringified =  data.toString()
    const dataJsoned = JSON.parse(stringified)
    res.status(201).json(dataJsoned)
  })
})

// view one article
app.get('/categories/:slug/:slugArticle', categoryExists, articleExists, (req, res) => {
  res.status(201).json(req.article)
})

// view articles according to the category
app.get('/categories/:slug', categoryExists, (req, res) => {
  fs.readFile('./articles.json', (err, data) => {
    if(err){
      res.json(err)
      return
    }
    const stringified =  data.toString()
    const dataJsoned = JSON.parse(stringified)
    const articles = dataJsoned.filter(art => art.category === req.params.slug)
    res.status(201).json({articles, category: req.category})
  })
})


// express validator error messages
const authorName = "Name is not long enough"
const missingTitle = 'Article title is missing'
const descLengthMin = 'Description is not long enough'

app.post('/categories/:slug',
  body("author").isLength({ min : 2 }).withMessage(authorName),
  body('title').isLength({ min : 1 }).withMessage(missingTitle),
  body('description').isLength({min: 50}).withMessage(descLengthMin),
    categoryExists, articleNotExist,
  (req, res) => {

  const { errors } = validationResult(req)

  if(errors.length > 0){
    res.status(404).json(errors)
  }else{
    const article = {
      ...req.body,
      category: req.params.slug,
      slug: slugify(req.body.title, { lower: true }),
      date: moment().format()
    }

    fs.readFile('./articles.json', (err, data) => {
      if(err){
        res.json(err)
        return
      }

      const articles = JSON.parse(data.toString())
      articles.push(article)

      fs.writeFile('./articles.json', JSON.stringify(articles), err => {
        res.json(err)
      })
    })
  }
  res.status(201).json('Article added successfully')
})


// delete article
app.delete('/categories/:slug/:slugArticle', categoryExists, articleExists, (req, res) => {

  fs.readFile('./articles.json', (err, data) => {
    if(err){
      res.json(err)
      return
    }
    const articles = JSON.parse(data.toString())
    articles.splice(req.articleIndex, 1)

    fs.writeFile('./articles.json', JSON.stringify(articles), err => {
      res.json(err)
    })
  })
  res.status(201).json(`The article "${req.article.title}" has been successfully deleted`)
})


// creer une article
// supprimer une article
// view all articles
// view articles according to the category

// modifier une article - Reste

// creer une categorie
// view categories










module.exports = app
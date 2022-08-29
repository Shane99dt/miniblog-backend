const express = require('express')
const app = express()
const fs = require('fs')
const { categoryExists } = require('../middlewares/categoriesMW')
const { articleExists } = require('../middlewares/articlesMW')
const slugify = require('slugify')
const articlesTable = require('../articles.json')
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
    res.status(201).json(articles)
  })
})


// express validator error messages
const authorName = "Name is not long enough"
const missingTitle = 'Article title is missing'
const descLengthMin = 'Description is not long enough'
const articleNameExists = 'Article name already exists'

app.post('/categories/:slug',
  body("author").isLength({ min : 2 }).withMessage(authorName),
  body('title').exists().withMessage(missingTitle).custom(value => {
    const slugified = slugify(value, { lower: true })
    const articleExists = articlesTable.find(art => art.slug === slugified)
    return !articleExists
  }).withMessage(articleNameExists),
  body('description').isLength({min: 50}).withMessage(descLengthMin),
    categoryExists,
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
  res.json('Article added successfully')
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











module.exports = app
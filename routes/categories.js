const express = require('express')
const app = express()
const fs = require('fs')
const { categoryExists } = require('../middlewares/categoriesMW')
const slugify = require('slugify')
const { body, validationResult } = require('express-validator')

app.get('/', (req, res) => {

  fs.readFile('./categories.json', (err, data) => {
    if(err){
      res.json(err)
      return
    }

    const stringified = data.toString()
    const dataJsoned = JSON.parse(stringified)
    res.json(dataJsoned)
  })
})

app.get('/:slug', categoryExists, (req, res) => {

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
const missingName = 'Category name is missing'
const missingDescription = 'Category description is missing'
const descLengthMin = 'Description is not long enough'
const descLengthMax = 'Description is too long'
const categoryNameExists = 'Category name already exists'

app.post('/',
  // body('name').exists().withMessage(missingName),
  // .custom(value => {
  //   fs.readFile('./categories.json', (err, data) => {
  //     if(err){
  //       res.json(err)
  //       return
  //     }
  //     const stringified =  data.toString()
  //     const dataJsoned = JSON.parse(stringified)

  //     const exists = dataJsoned.find(category => category.slug === slugify(value, { lower: true }))
  //     return exists
  //   })
  // }).withMessage(categoryNameExists),
  // body('description').exists().withMessage(missingDescription).isLength({min: 20}).withMessage(descLengthMin).isLength({max: 350}).withMessage(descLengthMax),
  (req, res) => {

  const category = {
    ...req.body,
    slug: slugify(req.body.name, { lower: true })
  }

  fs.readFile('./categories.json', (err, data) => {
    if(err){
      res.json(err)
      return
    }

    const categories = JSON.parse(data.toString())
    categories.push(category)

    fs.writeFile('./categories.json', JSON.stringify(categories), err => {
      res.json(err)
    })
  })

  res.json("one")

})















module.exports = app
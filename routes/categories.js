const express = require('express')
const app = express()
const fs = require('fs')
const slugify = require('slugify')
const { body, validationResult } = require('express-validator')
const { categoryNotExist } = require('../middlewares/categoriesMW')



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

// express validator error messages
const missingName = 'Category name is missing'
const missingDescription = 'Category description is missing'
const descLengthMin = 'Description is not long enough'
const descLengthMax = 'Description is too long'

app.post('/',
  body('name').isLength({min: 1}).withMessage(missingName),
  body('description').exists().withMessage(missingDescription).isLength({min: 20}).withMessage(descLengthMin).isLength({max: 350}).withMessage(descLengthMax), categoryNotExist,
  (req, res) => {

  const { errors } = validationResult(req)

  if(errors.length > 0){
    res.status(400).json(errors)
  }else{
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
  }
  res.status(201).json('Category added successfully')
})







module.exports = app
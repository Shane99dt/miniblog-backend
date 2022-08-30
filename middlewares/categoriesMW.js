const { default: slugify } = require('slugify')
const fs = require('fs')


const categoryNotExist = (req, res, next) => {

  fs.readFile('./categories.json', (err, data) => {
    if(err){
      res.status(500).json('Internal server error')
      return
    }
    const slugified = slugify(req.body.name, {lower: true})
    const dataJsoned = JSON.parse(data.toString())
    const category = dataJsoned.find(cat => cat.slug === slugified)

    if(!category){
      next()
    }else{
      res.status(409).json("Article already exists")
    }
  })
}

module.exports = { categoryNotExist }
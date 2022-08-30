const express = require('express')
const app = express()
const port = 5000
const morgan = require('morgan')
const cors = require('cors')
const categoriesRoutes = require('./routes/categories')
const articlesRoutes = require('./routes/articles')

app.use(cors())
app.use(morgan('tiny'))
app.use(express.json())

app.use('/categories', categoriesRoutes)
app.use('/articles', articlesRoutes)

app.listen(port, (req, res) =>{
  console.log(`running on port ${port}`)
})

const express = require('express')
const app = express()
const port = 5000
const morgan = require('morgan')
const cors = require('cors')
const categoriesRoutes = require('./routes/categories')

app.use(cors())
app.use(morgan('tiny'))

app.use(express.json())

app.listen(port, (req, res) =>{
  console.log(`running on port ${port}`)
})

app.use(('/categories'), categoriesRoutes)
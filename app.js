require('colors')
require('dotenv').config({silent: true})

const express = require('express')
const app = express()
const cors = require('cors')

const PORT = process.env.PORT || 3000
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const translationRoutes = require('./server/routes/translations')

// connect to mongoose (test or dev)
if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/translate-test')
  console.log('CONNECTING TO TEST SERVER...'.blue)
} else if (process.env.NODE_ENV === 'dev') {
  mongoose.connect('mongodb://localhost/translate-dev')
  console.log('CONNECTING TO DEV SERVER...'.blue)
} else {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/translate-production')
  console.log('CONNECTING TO PRODUCTION SERVER...'.blue)
}
mongoose.Promise = global.Promise

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.use('/translation', translationRoutes)

// root page
app.get('/', (req, res) => {
  res.send('Hi there, these are the routes for search: /translation/input/:params' + '\n' +
           '/translation/input/:params' + '\n' +
           'post: /translation/new to add new translations into the database')
})

app.listen(PORT, () => console.log(`Port ${PORT} listening...`))

module.exports = app

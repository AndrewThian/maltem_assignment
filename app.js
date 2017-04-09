require('colors')
require('dotenv').config({silent: true})

const express = require('express')
const app = express()
const cors = require('cors')

let PORT = 3000
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const translationRoutes = require('./server/routes/translations')

// connect to mongoose (test or dev)
const config = require('config')

console.log(config.get('test.database'))
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(config.get('test.database'))
  console.log('CONNECTING TO TEST SERVER...'.blue)
  PORT = 'test.port'
} else if (process.env.NODE_ENV === 'dev') {
  mongoose.connect(config.get('dev.database'))
  console.log('CONNECTING TO DEV SERVER...'.blue)
  PORT = 'dev.port'
} else if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGODB_URI || config.get('production.database'))
  console.log('CONNECTING TO PRODUCTION SERVER...'.blue)
  PORT = 'production.port'
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

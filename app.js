require('colors')
require('dotenv').config({silent: true})

const express = require('express')
const app = express()
const cors = require('cors')

const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const translationRoutes = require('./server/routes/translations')

// define port
let PORT = 8888 || process.env.PORT

// connect to mongoose (test or dev)
const config = require('config')
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(config.get('test.database'))
  console.log('CONNECTING TO TEST SERVER...'.blue)
  PORT = config.get('test.port')
} else if (process.env.NODE_ENV === 'dev') {
  mongoose.connect(config.get('dev.database'))
  console.log('CONNECTING TO DEV SERVER...'.blue)
  PORT = config.get('dev.port')
} else if (process.env.NODE_ENV === 'production') {
  mongoose.connect(process.env.MONGODB_URI || config.get('production.database'))
  console.log('CONNECTING TO PRODUCTION SERVER...'.blue)
  PORT = config.get('production.port')
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

let server = app.listen(PORT, () => console.log(`Port ${PORT} listening...`))

module.exports = {
  app: app,
  server: server
}

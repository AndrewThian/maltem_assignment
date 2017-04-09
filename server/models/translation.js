const mongoose = require('mongoose')
const InputSchema = require('./input').Schema
const OutputSchema = require('./output').Schema

const TranslationSchema = mongoose.Schema({
  input: InputSchema,
  output: OutputSchema
})

const Translation = mongoose.model('Translation', TranslationSchema)

module.exports = Translation

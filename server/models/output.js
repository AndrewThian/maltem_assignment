const mongoose = require('mongoose')
const Schema = mongoose.Schema

const OutputSchema = new Schema({
  code: {
    type: Number
  },
  lang: {
    type: String
  },
  text: {
    type: String,
    required: true
  }
})

const Output = mongoose.model('Output', OutputSchema)

module.exports = {
  Schema: OutputSchema,
  model: Output
}

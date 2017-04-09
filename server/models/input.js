const mongoose = require('mongoose')
const Schema = mongoose.Schema

const InputSchema = new Schema({
  lang: {
    type: String
  },
  text: {
    type: String,
    required: true
  }
})

const Input = mongoose.model('Input', InputSchema)

module.exports = {
  Schema: InputSchema,
  model: Input
}

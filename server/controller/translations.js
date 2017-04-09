require('colors')
require('dotenv').config({silent: true})
let Translation = require('../models/translation')
let request = require('request')

let translationController = {
  // find input
  searchInput: (req, res) => {
    let inputText = req.params.text
    Translation.findOne({
      'input.text': inputText
    }, (err, translation) => {
      // if (err) return console.log(err.toString().red)
      if (err) return res.status(404).send(err)
      if (!translation) res.status(404).send({ msg: 'Translation not found' })
      else res.status(200).send(translation)
    })
  },

  // find output
  searchOutput: (req, res) => {
    let outputText = req.params.text
    Translation.findOne({
      'output.text': outputText
    }, (err, translation) => {
      // if (err) return console.log(err.toString().red)
      if (err) return res.status(404).send(err)
      if (!translation) res.status(404).send({ msg: 'Translation not found' })
      else res.status(200).send(translation)
    })
  },

  // add custom translation
  createTranslation: (req, res) => {
    let input = req.body.input
    let output = req.body.output
    Translation.create({
      input: input,
      output: output
    }, (err, translation) => {
      // if (err) return console.log(err.toString().red)
      if (err) return res.status(400).send(err)
      res.status(200).send({ msg: 'Translation successfully added' })
    })
  },

  // translation controller with API post request
  translate: (req, res) => {
    let inputLang = req.params.lang
    let inputText = req.params.text
    let keyAPI = process.env.API_KEY
    let URL = 'https://translate.yandex.net/api/v1.5/tr.json/translate'
    Translation.findOne({
      'input.lang': inputLang,
      'input.text': inputText
    }, (err, translation) => {
      if (err) return console.log(err.toString().red)
      // if input query does not exist in database, fire off request to translate
      if (!translation) {
        request.post({
          url: URL,
          form: { key: keyAPI,
                  text: inputText,
                  lang: inputLang }
        }, (err, response, body) => {
          if (err) if (err) res.status(400).send(err)
          let translation = JSON.parse(body)
          // add translation to database and return json obj
          Translation.create({
            input: { lang: inputLang,
                     text: inputText },
            output: { lang: translation.lang,
                      text: translation.text[0] }
          }, (err, translation) => {
            if (err) res.status(400).send(err)
            res.status(200).send(translation)
          })
        })
      } else {
        res.status(200).send(translation)
      }
    })
  }
}

module.exports = translationController

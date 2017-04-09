/* globals describe it */
require('colors')
require('dotenv').config({silent: true})
const expect = require('chai').expect
const request = require('supertest')
const app = require('../app')
const requestModule = require('request')
const Translation = require('../server/models/translation.js')

// TEST DATA
let inputTest = {
  lang: 'fr',
  text: 'French test routes'
}

let inputTest2 = {
  lang: 'FR',
  text: 2013
}

let wrongInput = 'Wrong input'

let outputTest = {
  lang: 'en',
  text: 'English translate test routes'
}

let wrongOutput = 'Wrong output'

describe('CONTROLLER TEST SUITE', () => {
  describe('Test: Clear test database', () => {
    it('should clear database for test env', (done) => {
      Translation.remove({}, (err, translations) => {
        if (err) return console.log(err.toString().red)
        expect(translations.result).to.be.an('object')
        expect(translations.result.ok).to.equal(1)
        done()
      })
    })
  })

  describe('Test: Create route in controller (add new translation)', () => {
    it('should return a json obj with the msg: Translation successfully added', (done) => {
      request(app).post('/translation/new')
      .set('Content-Type', 'application/json')
      .send({
        input: inputTest,
        output: outputTest
      })
      .end((err, res) => {
        if (err) return console.log(err.toString().red)
        expect(res.body.msg).to.equal('Translation successfully added')
        expect(res.status).to.equal(200)
        done()
      })
    })

    it('should have test results in database', (done) => {
      Translation.findOne({
        'input.text': inputTest.text
      }, (err, translation) => {
        if (err) return console.log(err.toString().red)
        // checking if data went into the database
        expect(translation).to.exist
        expect(translation.input.text).to.equal(inputTest.text)
        expect(translation.output.text).to.equal(outputTest.text)
        done()
      })
    })
  })

  describe('Test: Find Translations via search input route', () => {
    it('should return a json object of found translation', (done) => {
      request(app).get(`/translation/input/${inputTest.text}`)
      .end((err, res) => {
        if (err) return console.log(err.toString().red)
        expect(res.body).to.be.json
        expect(res.status).to.equal(200)
        expect(res.body.input.lang).to.equal(inputTest.lang)
        expect(res.body.input.text).to.equal(inputTest.text)
        done()
      })
    })

    it('should return a err msg if not found', (done) => {
      request(app).get(`/translation/input/${wrongInput}`)
      .end((err, res) => {
        if (err) return console.log(err.toString().red)
        expect(res.body).to.be.json
        expect(res.status).to.equal(404)
        expect(res.body.msg).to.equal('Translation not found')
        done()
      })
    })
  })

  describe('Test: Find Translations via search output route', () => {
    it('should return a json object of found translation', (done) => {
      request(app).get(`/translation/output/${outputTest.text}`)
      .end((err, res) => {
        if (err) return console.log(err.toString().red)
        expect(res.body).to.be.json
        expect(res.status).to.equal(200)
        expect(res.body.output.lang).to.equal(outputTest.lang)
        expect(res.body.output.text).to.equal(outputTest.text)
        done()
      })
    })

    it('should return a error msg if not found', (done) => {
      request(app).get(`/translation/input/${wrongOutput}`)
      .end((err, res) => {
        if (err) return console.log(err.toString().red)
        expect(res.body).to.be.json
        expect(res.status).to.equal(404)
        expect(res.body.msg).to.equal('Translation not found')
        done()
      })
    })
  })

  describe('Test: API request', () => {
    // clearing my database before next set of tests
    describe('Test: Clear test database', () => {
      it('should clear database for test env', (done) => {
        Translation.remove({}, (err, translations) => {
          if (err) return console.log(err.toString().red)
          expect(translations.result).to.be.an('object')
          expect(translations.result.ok).to.equal(1)
          done()
        })
      })
    })

    it('should return translated object with test input', (done) => {
      // testing if API is working and returning data
      let keyAPI = process.env.API_KEY
      let URL = 'https://translate.yandex.net/api/v1.5/tr.json/translate'
      requestModule.post({
        url: URL,
        form: { key: keyAPI,
                lang: inputTest.lang,
                text: inputTest.text }
      }, (err, response, body) => {
        if (err) return console.log(err.toString().red)
        let translation = JSON.parse(body)
        expect(translation).to.be.json
        expect(translation).to.have.property('lang')
        expect(translation).to.have.property('text')
        expect(translation.code).to.equal(200)
        done()
      })
    })

    it('should return error if wrong language parameters given', (done) => {
      let keyAPI = process.env.API_KEY
      let URL = 'https://translate.yandex.net/api/v1.5/tr.json/translate'
      requestModule.post({
        url: URL,
        form: { key: keyAPI,
                lang: inputTest2.lang,
                text: inputTest.text }
      }, (err, response, body) => {
        if (err) return console.log(err.toString().red)
        let translation = JSON.parse(body)
        expect(translation).to.be.json
        expect(translation).to.have.property('message')
        expect(translation.message).to.equal('Invalid parameter: lang')
        expect(translation.code).to.equal(502)
        done()
      })
    })
  })

  describe('TEST translate route', () => {
    // testing if route returns an object from the database
    it('should return a json object', (done) => {
      request(app).post(`/translation/${inputTest.lang}/${inputTest.text}`)
      .end((err, res) => {
        if (err) return console.log(err.toString().red)
        expect(res.body).to.be.json
        expect(res.status).to.equal(200)
        expect(res.body).to.have.property('_id')
        expect(res.body).to.have.property('input')
        expect(res.body).to.have.property('output')
        done()
      })
    })

    it('should add translation to database', (done) => {
      // checking if translated data is in database
      Translation.findOne({
        'input.text': inputTest.text
      }, (err, translation) => {
        if (err) return console.log(err.toString().red)
        expect(translation).to.exist
        expect(translation).to.have.property('_id')
        expect(translation).to.have.property('input')
        expect(translation.input.text).to.equal('French test routes')
        expect(translation).to.have.property('output')
        expect(translation.output.text).to.equal('Test de français routes')
        done()
      })
    })
  })
})

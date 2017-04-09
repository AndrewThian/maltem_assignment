/* globals it describe  */
require('colors')
const expect = require('chai').expect
const request = require('supertest')
const app = require('../app')
const Translation = require('../server/models/translation.js')

// TEST DATA
let inputTest = {
  text: 'French test'
}

let outputTest = {
  text: 'English translate test'
}

let dirtyInput1 = {
  lang: 10
}

let dirtyOutput1 = {
  lang: 'EN'
}

// TESTS
describe('MODEL TEST SUITE', () => {
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

  describe('Test: Translation Model Validation', () => {
    it('should create a translation with empty object with properties', (done) => {
      Translation.create({}, (err, translation) => {
        if (err) return console.log(err.toString().red)
        expect(translation).to.be.an('object')
        expect(translation).to.have.property('_id')
        expect(translation).to.have.property('input')
        expect(translation).to.have.property('output')
        done()
      })
    })

    it('should add input data into database', (done) => {
      Translation.findOne({}, (err, translation) => {
        if (err) return console.log(err.toString().red)
        translation.input = inputTest
        translation.save((err, updated) => {
          if (err) return console.log(err.toString().red)
          expect(updated.input).to.be.an('object')
          expect(updated.input).to.have.property('_id')
          expect(updated.input).to.have.property('text')
          expect(updated.input.text).to.be.an('string')
          done()
        })
      })
    })

    it('should add output data into database', (done) => {
      Translation.findOne({}, (err, translation) => {
        if (err) return console.log(err.toString().red)
        translation.output = outputTest
        translation.save((err, updated) => {
          if (err) return console.log(err.toString().red)
          expect(updated.output).to.be.an('object')
          expect(updated.output).to.have.property('_id')
          expect(updated.output).to.have.property('text')
          expect(updated.output.text).to.be.an('string')
          done()
        })
      })
    })
  })

  describe('Test: Input Model Validation', () => {
    it('should throw a VALIDATION error if text is not defined', (done) => {
      Translation.create({}, (err, translation) => {
        if (err) return console.log(err.toString().red)
        translation.input = dirtyInput1
        translation.save((err, updated) => {
          expect(err.name).to.equal('ValidationError')
          expect(err.message).to.equal('Translation validation failed')
          expect(err.toString()).to.equal('ValidationError: Path `text` is required., ValidationError: Path `text` is required.')
          done()
        })
      })
    })

    it('should find translation with given input params', (done) => {
      Translation.findOne({
        'input.text': 'French test'
      }, (err, translation) => {
        if (err) return console.log(err.toString().red)
        expect(translation.input.text).to.equal(inputTest.text)
        expect(translation.output.text).to.equal(outputTest.text)
        done()
      })
    })
  })

  describe('Test: Output Model Validation', () => {
    it('should throw a VALIDATION error if text is not defined', (done) => {
      Translation.create({}, (err, translation) => {
        if (err) return console.log(err.toString().red)
        translation.output = dirtyOutput1
        translation.save((err, updated) => {
          expect(err.name).to.equal('ValidationError')
          expect(err.message).to.equal('Translation validation failed')
          expect(err.toString()).to.equal('ValidationError: Path `text` is required., ValidationError: Path `text` is required.')
          done()
        })
      })
    })

    it('should find translation with given output params', (done) => {
      Translation.findOne({
        'output.text': 'English translate test'
      }, (err, translation) => {
        if (err) return console.log(err.toString().red)
        expect(translation.input.text).to.equal(inputTest.text)
        expect(translation.output.text).to.equal(outputTest.text)
        done()
      })
    })
  })
})

const express = require('express')
const router = express.Router()
const translationController = require('../controller/translations.js')

router.get('/input/:text', translationController.searchInput)

router.get('/output/:text', translationController.searchOutput)

router.post('/new', translationController.createTranslation)

router.post('/:lang/:text', translationController.translate)

module.exports = router

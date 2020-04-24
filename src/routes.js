const express = require("express")
const SessionController = require('./app/controllers/SessionController')
const RecipientController = require('./app/controllers/RecipientController')
const FileController = require('./app/controllers/FileController')
const auth = require('./app/middlewares/auth')
const multer = require('multer')(require('./config/multer'))
const routes = new express.Router()

routes.post('/sessions', SessionController.store)
routes.post('/recipients', auth, RecipientController.store)
routes.put('/recipients/:recipientId', auth, RecipientController.update)
routes.post('/files', multer.single('file'), FileController.store)
module.exports = routes
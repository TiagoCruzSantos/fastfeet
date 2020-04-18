const express = require("express")
const SessionController = require('./app/controllers/SessionController')
const RecipientController = require('./app/controllers/RecipientController')
const auth = require('./app/middlewares/auth')
const routes = new express.Router()

routes.post('/sessions', SessionController.store)
routes.post('/recipient', auth, RecipientController.store)
module.exports = routes
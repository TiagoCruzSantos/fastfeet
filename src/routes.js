const express = require("express")
const SessionController = require('./app/controllers/SessionController')
const routes = new express.Router()

routes.post('/sessions', SessionController.store)

module.exports = routes
const express = require("express")
const SessionController = require('./app/controllers/SessionController')
const RecipientController = require('./app/controllers/RecipientController')
const FileController = require('./app/controllers/FileController')
const DeliverymanController = require('./app/controllers/DeliverymanController')
const OrderController = require('./app/controllers/OrderController')
const auth = require('./app/middlewares/auth')
const multer = require('multer')(require('./config/multer'))
const routes = new express.Router()

routes.post('/sessions', SessionController.store)

routes.use(auth)

routes.post('/recipients', RecipientController.store)
routes.put('/recipients/:recipientId', RecipientController.update)

routes.post('/files', multer.single('file'), FileController.store)

routes.post('/deliverymen', DeliverymanController.store)
routes.put('/deliverymen', DeliverymanController.update)
routes.get('/deliverymen', DeliverymanController.index)
routes.delete('/deliverymen/:deliverymanId', DeliverymanController.delete)

routes.post('/orders', OrderController.store)

module.exports = routes
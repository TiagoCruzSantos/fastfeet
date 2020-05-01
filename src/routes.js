const express = require("express")
const SessionController = require('./app/controllers/SessionController')
const RecipientController = require('./app/controllers/RecipientController')
const FileController = require('./app/controllers/FileController')
const DeliverymanController = require('./app/controllers/DeliverymanController')
const OrderController = require('./app/controllers/OrderController')
const DeliveryController = require('./app/controllers/DeliveryController')
const ProblemsController = require('./app/controllers/ProblemsController')
const DeliveryProblemsController = require('./app/controllers/DeliveryProblemsController')
const auth = require('./app/middlewares/auth')
const multer = require('multer')(require('./config/multer'))
const routes = new express.Router()

routes.post('/sessions', SessionController.store)

routes.get('/deliverymen/:deliverymanId/deliveries', DeliveryController.index)
routes.put('/deliverymen/:deliverymanId/deliveries/:deliveryId', DeliveryController.update)

routes.post('/delivery/:deliveryId/problems', ProblemsController.store)

routes.use(auth)

routes.get('/problems', DeliveryProblemsController.index)
routes.delete('/problem/:problemId/cancel-delivery', ProblemsController.delete)

routes.get('/delivery/:deliveryId/problems', ProblemsController.index)
routes.delete('/problem/:problemId/cancel-delivery', ProblemsController.delete)

routes.post('/recipients', RecipientController.store)
routes.put('/recipients/:recipientId', RecipientController.update)

routes.post('/files', multer.single('file'), FileController.store)

routes.post('/deliverymen', DeliverymanController.store)
routes.put('/deliverymen', DeliverymanController.update)
routes.get('/deliverymen', DeliverymanController.index)
routes.delete('/deliverymen/:deliverymanId', DeliverymanController.delete)

routes.post('/orders', OrderController.store)
routes.get('/orders', OrderController.index)
routes.put('/orders/:orderId', OrderController.update)
routes.delete('/orders/:orderId', OrderController.delete)

module.exports = routes
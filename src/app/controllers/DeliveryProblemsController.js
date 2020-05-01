const Order = require('../models/Order')
const Problem = require('../models/Problem')

class DeliveryProblemController{
    async index(req, res){
        const orders = await Order.findAll({
            attributes: ['id', 'product'],
            include: [{
                model: Problem,
                as: 'problems',
            }]
        })

        return res.json(orders)
    }
}

module.exports = new DeliveryProblemController()
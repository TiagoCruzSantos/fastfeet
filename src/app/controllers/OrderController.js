const Order = require('../models/Order')
const Recipient = require('../models/Recipient')
const Deliveryman = require('../models/Deliveryman')
const Yup = require('yup')

class OrderController{
    //TODO: implementar paginação
    async index(req, res){

        return res.json()
    }

    async store(req, res){
        const schema = Yup.object().shape({
            recipient_id: Yup.number().required(),
            deliveryman_id: Yup.number().required(),
            product: Yup.string().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: 'Validation failed'})
        }

        const {recipient_id, deliveryman_id} = req.body

        const recipient = await Recipient.findByPk(recipient_id)
        if(!recipient){
            return res.status(401).json({error: 'Invalid recipient'})
        }
        const deliveryman = await Deliveryman.findByPk(deliveryman_id)
        if(!deliveryman){
            return res.status(401).json({error: 'Invalid delivery man'})
        }

        const order = await Order.create(req.body)

        //enviar email

        return res.json(order)
    }

    async update(req, res){
        return res.json()
    }

    async delete(req, res){
        return res.json()
    }
}

module.exports = new OrderController()
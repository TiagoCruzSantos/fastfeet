const Order = require('../models/Order')
const Recipient = require('../models/Recipient')
const Deliveryman = require('../models/Deliveryman')
const File = require('../models/File')
const Yup = require('yup')

class OrderController{
    async index(req, res){
        const {page = 1} = req.query

        const orders = await Order.findAll({
            attributes: ['id', 'product', 'canceled_at', 'start_date', 'end_date'],
            include: [{
                model: File,
                as: 'signature',
                attributes: ['id', 'path', 'url']
            },{
                model: Recipient,
                as: 'recipient',
                attributes: ['id', 'name', 'street', 'number', 'complement', 'state', 'city', 'cep']
            },{
                model: Deliveryman,
                as: 'deliveryman',
                attributes: ['id', 'name', 'email'],
                include: [{
                    model: File,
                    as: 'avatar',
                    attributes: ['id', 'path', 'url']
                }]
            }],
            limit: 20,
            offset: (page - 1) * 20
        })

        return res.json(orders)
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
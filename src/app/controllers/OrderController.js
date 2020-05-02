const Order = require('../models/Order')
const Recipient = require('../models/Recipient')
const Deliveryman = require('../models/Deliveryman')
const File = require('../models/File')
const Mail = require('../../lib/Mail')
const Yup = require('yup')
const {parseISO} = require('date-fns')

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

        await Mail.sendMail({
            to: `${deliveryman.name} <${deliveryman.email}>`,
            subject: 'Nova entrega',
            template: 'delivery_created',
            context: {
                deliveryman_name: deliveryman.name,
                recipient_name: recipient.name,
                recipient_street: recipient.street,
                recipient_number: recipient.number,
                recipient_complement: recipient.complement,
                recipient_state: recipient.state,
                recipient_city: recipient.city,
                recipient_cep: recipient.cep
            }
        })

        return res.json(order)
    }

    async update(req, res){
        const schema = Yup.object().shape({
            recipient_id: Yup.number(),
            deliveryman_id: Yup.number(),
            product: Yup.string(),
            canceled_at: Yup.string(),
            start_date: Yup.string(),
            end_date: Yup.string(),
            signature_id: Yup.number().when('end_date', (end_date, field) => 
                (end_date ? field.required() : field)
            ),
        })

        if(!(await schema.isValid(req.body))){
            return res.json({error: 'Validation failed'})
        }

        const order = await Order.findByPk(req.params.orderId)

        if(!order){
            return res.status(401).json({error: 'This order does not exist'})
        }
        
        req.body.canceled_at = req.body.canceled_at ? parseISO(req.body.canceled_at) : undefined
        req.body.start_date = req.body.start_date ? parseISO(req.body.start_date) : undefined
        req.body.end_date = req.body.end_date ? parseISO(req.body.end_date) : undefined

        await order.update(req.body)

        return res.json(order)
    }

    async delete(req, res){
        const order = await Order.findByPk(req.params.orderId)

        if(!order){
            return res.status(401).json({error: 'This order does not exist'})
        }

        order.destroy()
        return res.json(order)
    }
}

module.exports = new OrderController()
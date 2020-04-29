const Order = require('../models/Order')
const Recipient = require('../models/Recipient')
const {parseISO} = require('date-fns')
const Yup = require('yup')

class DeliveriyController{
    async index(req, res){
        const orders = await Order.findAll({
            attributes: ['id','product'],
            include: [{
                model: Recipient,
                as: 'recipient',
                attributes: ['id','name']
            }],
            where: {
                deliveryman_id: req.params.deliverymanId,
                canceled_at: null,
                end_date: null
            }
        })

        return res.json(orders)
    }


    async update(req, res){
        //TODO: 5 retiradas por dia
        const schema = Yup.object().shape({
            start_date: Yup.string(),
            end_date: Yup.string(),
            signature_id: Yup.number().when('end_date', (end_date, field) => 
                (end_date ? field.required() : field)
            )
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: 'Validation failed'})
        }

        const order = await Order.findByPk(req.params.deliveryId)

        if(!order){
            return res.status(401).json({error: 'Order does not exist'})
        }

        if(order.deliveryman_id !== parseInt(req.params.deliverymanId)){
            return res.status(400).json({error: 'This deliveryman is not assingned to this delivery'})
        }

        const {start_date, end_date, signature_id} = req.body

        if(start_date && end_date){
            return res.status(400).json({error: 'You cannot set a end date and a start date at the same time'})
        }

        if(order.start_date === null && end_date){
            return res.status(400).json({error: 'This order does not have a start date'})
        }

        req.body.start_date = req.body.start_date ? parseISO(req.body.start_date) : undefined
        req.body.end_date = req.body.end_date ? parseISO(req.body.end_date) : undefined

        await order.update(req.body)

        return res.json(order)
    }
}

module.exports = new DeliveriyController()
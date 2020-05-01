const Problem = require('../models/Problem')
const Order = require('../models/Order')
const Yup = require('yup')

class ProblemsController{
    async index(req, res){
        const problems = await Problem.findAll({
            where: {
                delivery_id: req.params.deliveryId
            },
            attributes: ['id', 'description', 'delivery_id'],
            include: [{
                model: Order,
                as: 'delivery',
                attributes: ['id', 'product', 'deliveryman_id', 'recipient_id']
            }]
        })

        return res.json(problems)
    }

    async store(req, res){
        const schema = Yup.object().shape({
            description: Yup.string().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.json({error: 'Validation failed'})
        }

        req.body.delivery_id = req.params.deliveryId

        const {id, delivery_id, description} = await Problem.create(req.body)

        return res.json({
            id,
            delivery_id,
            description
        })
    }

    async delete(req, res){
        const problem  = await Problem.findByPk(req.params.problemId, {
            include :[{
                model: Order,
                as: 'delivery'
            }]
        })


        if(!problem){
            return res.status(404).json({error: 'There are no problems with this id'})
        }

        const delivery = problem.delivery

        await delivery.update({canceled_at: new Date()})

        return res.json(delivery)
    }
}

module.exports = new ProblemsController()
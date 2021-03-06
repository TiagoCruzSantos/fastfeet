const Recipient = require('../models/Recipient')
const Yup = require('yup')

class RecipientController {
    async store(req, res){
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            street: Yup.string().required(),
            number: Yup.number().required(),
            complement: Yup.string(),
            state: Yup.string().required(),
            city: Yup.string().required(),
            cep: Yup.string().required().matches(/^\d{5}-\d{3}$/)
        })
        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: 'Validation failed'})
        }
        const {name, id, street, number, complement, state, city, cep} = await Recipient.create(req.body)
        return res.json({
            name,
            id,
            street,
            number,
            complement,
            state,
            city,
            cep
        })
    }

    async update(req, res){
        const {recipientId} = req.params

        if(!recipientId){
            return res.status(400).json({error: 'Recipient id is missing'})
        }

        const recipient = await Recipient.findByPk(recipientId)

        if(!recipient){
            return res.status(404).json({error: 'Recipient not found'})
        }

        const {name, id, street, number, complement, state, city, cep} = await recipient.update(req.body)
        return res.json({
            name,
            id,
            street,
            number,
            complement,
            state,
            city,
            cep
        })
    }
}

module.exports = new RecipientController()
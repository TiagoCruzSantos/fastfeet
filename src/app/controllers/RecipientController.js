const Recipient = require('../models/Recipient')
const Yup = require('yup')

class RecipientController {
    async store(req, res){
        const schema = Yup.object().shape({
            street: Yup.string().required(),
            number: Yup.number().required(),
            complement: Yup.string(),
            state: Yup.string().required(),
            city: Yup.string().required(),
            cep: Yup.string().required()
        })
        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: 'Validation failed'})
        }
        const {id, street, number, complement, state, city, cep} = await Recipient.create(req.body)
        return res.json({
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
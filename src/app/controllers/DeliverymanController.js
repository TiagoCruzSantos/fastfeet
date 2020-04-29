const Deliveryman = require('../models/Deliveryman')
const File = require('../models/File')
const Yup = require('yup')

class DeliverymanController{
    async index(req, res){
        const {page = 1} = req.query
        const deliverymen = await Deliveryman.findAll({
            attributes: ['name', 'email', 'id'],
            include: [{
                model: File,
                as: 'avatar',
                attributes: ['path','url']
            }],
            limit: 20,
            offset: (page - 1) * 20
        })
        return res.json(deliverymen)
    }

    async store(req, res){
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: 'Validation error'})
        }

        const {email, name} = req.body

        let deliveryman = await Deliveryman.findOne({
            where: {
                email
            }
        })

        if(deliveryman){
            return res.status(401).json({error: 'Email in use'})
        }

        deliveryman = await Deliveryman.create(req.body)

        return res.json(deliveryman)
    }

    async update(req, res){
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            avatar_id: Yup.number(),
            id: Yup.number().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error: 'Validation failed'})
        }

        let {id, name, email, avatar_id} = req.body

        let deliveryman = await Deliveryman.findByPk(id)

        if(!deliveryman){
            return res.status(404).json({error: `There are no delivery men with id ${id}`})
        }

        if(email && email !== deliveryman.email){
            let checkEmail = await Deliveryman.findOne({where: {email}})
            if(checkEmail){
                return res.status(401).json({error: 'Email already in use'})
            }
        }

        if(avatar_id){
            let checkFile = await File.findByPk(avatar_id)
            if(!checkFile){
                return res.status(404).json({error: 'File not found'})
            }
        }

        await deliveryman.update(req.body)

        return res.json({
            name,
            email,
            avatar_id
        })
    }

    async delete(req,res){
        const deliveryman = await Deliveryman.findByPk(req.params.deliverymanId)
        if(deliveryman){
            deliveryman.destroy()
            return res.json({ok: `${deliveryman.name} has been successfully deleted`})
        }
        return res.status(400).json({error: `There are no delivery men with id ${req.params.deliverymanId}`})
    }
}

module.exports = new DeliverymanController()
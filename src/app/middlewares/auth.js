const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const authConfig = require('../../config/auth')


module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(401).json({error: 'Token not provided'})
    }

    
    try{
        const [, token] = authHeader.split(' ')
        const decoded = await promisify(jwt.verify)(token, authConfig.secret)
        req.userId = decoded.id
        return next()
    }catch (e){
        return res.status(401).json({error: 'Invalid Token'})
    }


}
const Sequelize = require('sequelize')
const User = require('../app/models/User')
const Recipient = require('../app/models/Recipient')
const databaseConfig = require('../config/database')

const models = [User, Recipient]

class Database {
    constructor(){
        this.init()
    }

    init(){
        this.connection = new Sequelize(databaseConfig.url, databaseConfig)
        models.map(model => model.init(this.connection))
    }
}

module.exports = new Database()
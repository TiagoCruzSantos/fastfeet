const Sequelize = require('sequelize')
const User = require('../app/models/User')
const Recipient = require('../app/models/Recipient')
const File = require('../app/models/File')
const Deliveryman = require('../app/models/Deliveryman')
const Order = require('../app/models/Order')
const databaseConfig = require('../config/database')

const models = [User, Recipient, File, Deliveryman, Order]

class Database {
    constructor(){
        this.init()
    }

    init(){
        this.connection = new Sequelize(databaseConfig.url, databaseConfig)
        models.map(model => model.init(this.connection)).map(model => model.associate && model.associate(this.connection.models))
    }
}

module.exports = new Database()
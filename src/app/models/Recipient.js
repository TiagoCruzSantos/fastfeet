const Sequelize = require('sequelize')

class Recipient extends Sequelize.Model{
    static init(sequelize){
        super.init({
            name: Sequelize.STRING,
            street: Sequelize.STRING,
            number: Sequelize.INTEGER,
            complement: Sequelize.STRING,
            state: Sequelize.STRING,
            city: Sequelize.STRING,
            cep: Sequelize.STRING
        },{
            sequelize
        })

        return this
    }
}

module.exports = Recipient
const Sequelize = require('sequelize')

class Problem extends Sequelize.Model{
    static init(sequelize){
        super.init({
            description: Sequelize.STRING
        },{
            sequelize,
            tableName: 'delivery_problems'
        })

        return this
    }

    static associate(models){
        this.belongsTo(models.Order, {foreignKey: 'delivery_id', as: 'delivery'})
    }
}

module.exports = Problem
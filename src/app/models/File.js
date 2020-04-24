const Sequelize = require('sequelize')
const Model = Sequelize.Model

class File extends Model {
    static init(sequelize){
        super.init({
            name: Sequelize.STRING,
            path: Sequelize.STRING,
            url: {
                type: Sequelize.VIRTUAL,
                get(){
                    return `${process.env.HOST_URL}/files/${this.path}`
                }
            }
        },
        {
            sequelize
        })

        return this
    }
}

module.exports = File
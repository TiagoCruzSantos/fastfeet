'use strict';
const bcrypt = require('bcryptjs')

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('users', [{
        name: process.env.DEFAULT_NAME,
        email: process.env.DEFAULT_EMAIL,
        password_hash: bcrypt.hashSync(process.env.DEFAULT_PASSWORD, 8),
        created_at: new Date(),
        updated_at: new Date()
      }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};

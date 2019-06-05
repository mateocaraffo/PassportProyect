const Sequelize = require('sequelize');

const db = new Sequelize('passport', 'federicomoralesotero', '12345', {
    host: 'localhost',
    dialect:'postgres'
  });

  module.exports = db;
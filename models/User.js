const Sequelize = require('sequelize');
const db = require('../config/database');
const crypto = require('crypto');


const User = db.define('users', {
    email: {
        type: Sequelize.STRING,
        isEmail: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    salt: {
        type: Sequelize.STRING,
    }
},
    {
        instanceMethod: {
            autent: function (password) {
                if (this.password == this.hashPassword(password)) return true;
                return false;
            }
        }
    }
)

User.addHook("beforeCreate", function(user){
        user.salt = crypto.randomBytes(20).toString('hex');
        user.password = user.hashPassword(user.password);
});

User.prototype.hashPassword = function(password){
     return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
}

module.exports = User;
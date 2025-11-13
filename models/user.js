'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Recipe, {
                foreignKey: 'userId',
                as: 'recipes',
                onDelete: 'CASCADE',
            });
        }
    }
    User.init({
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user' // Ролі: 'visitor', 'user', 'admin'
        }
    }, {
        sequelize,
        modelName: 'User',
        hooks: {
            beforeCreate: async(user) => {
                if (user.password) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            }
        }
    });
    return User;
};
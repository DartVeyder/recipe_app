'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            Category.hasMany(models.Recipe, {
                foreignKey: 'categoryId',
                as: 'recipes',
            });
        }
    }
    Category.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'Category',
    });
    return Category;
};
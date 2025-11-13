'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Ingredient extends Model {
        static associate(models) {
            Ingredient.belongsToMany(models.Recipe, {
                through: 'RecipeIngredient',
                foreignKey: 'ingredientId',
                as: 'recipes'
            });
        }
    }
    Ingredient.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'Ingredient',
    });
    return Ingredient;
};
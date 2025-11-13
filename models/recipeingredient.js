'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class RecipeIngredient extends Model {
        static associate(models) {
            // define association here
        }
    }
    RecipeIngredient.init({
        recipeId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Recipes',
                key: 'id'
            }
        },
        ingredientId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Ingredients',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'RecipeIngredient',
    });
    return RecipeIngredient;
};
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Recipe extends Model {
        static associate(models) {
            Recipe.belongsTo(models.User, { foreignKey: 'userId', as: 'author' });
            Recipe.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
            Recipe.belongsToMany(models.Ingredient, {
                through: 'RecipeIngredient',
                foreignKey: 'recipeId',
                as: 'ingredients'
            });
        }
    }
    Recipe.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        instructions: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Recipe',
    });
    return Recipe;
};
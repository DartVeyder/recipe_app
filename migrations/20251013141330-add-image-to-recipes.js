'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Recipes', 'image', {
            type: Sequelize.STRING,
            allowNull: true, // Дозволяємо рецептам існувати без фото
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Recipes', 'image');
    }
};
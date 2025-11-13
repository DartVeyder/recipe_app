'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
    up: async(queryInterface, Sequelize) => {
        // Створення адміна
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = await queryInterface.bulkInsert('Users', [{
            username: 'Admin',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date(),
        }], { returning: true });

        // Створення категорій
        const categories = await queryInterface.bulkInsert('Categories', [
            { name: 'Супи', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Салати', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Десерти', createdAt: new Date(), updatedAt: new Date() },
        ], { returning: true });

        // Створення інгредієнтів
        await queryInterface.bulkInsert('Ingredients', [
            { name: 'Картопля', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Морква', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Цибуля', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Помідори', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Огірки', createdAt: new Date(), updatedAt: new Date() },
        ], {});
    },

    down: async(queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('RecipeIngredients', null, {});
        await queryInterface.bulkDelete('Ingredients', null, {});
        await queryInterface.bulkDelete('Recipes', null, {});
        await queryInterface.bulkDelete('Categories', null, {});
        await queryInterface.bulkDelete('Users', null, {});
    }
};
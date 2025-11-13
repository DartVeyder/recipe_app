const express = require('express');
const router = express.Router();
const { Recipe } = require('../models');

// Підключення маршрутів
router.use('/auth', require('./auth'));
router.use('/recipes', require('./recipes'));
router.use('/categories', require('./categories'));
router.use('/ingredients', require('./ingredients'));

// Головна сторінка
router.get('/', async(req, res) => {
    const latestRecipes = await Recipe.findAll({
        limit: 5,
        order: [
            ['createdAt', 'DESC']
        ],
        include: 'author',
    });
    res.render('index', { title: 'Головна', latestRecipes });
});

module.exports = router;
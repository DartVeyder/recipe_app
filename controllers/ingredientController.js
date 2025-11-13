const { Ingredient } = require('../models');
const { validationResult } = require('express-validator');

exports.getIngredients = async(req, res) => {
    const ingredients = await Ingredient.findAll();
    res.render('ingredients/index', {
        title: 'Керування інгредієнтами',
        ingredients,
        errors: {},
        old: {},
    });
};

exports.createIngredient = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const ingredients = await Ingredient.findAll();
        return res.status(400).render('ingredients/index', {
            title: 'Керування інгредієнтами',
            ingredients,
            errors: errors.mapped(),
            old: req.body,
        });
    }

    try {
        await Ingredient.create({ name: req.body.name });
        req.flash('success_msg', 'Інгредієнт створено');
    } catch (err) {
        req.flash('error_msg', 'Такий інгредієнт вже існує');
    }
    res.redirect('/ingredients');
};

exports.deleteIngredient = async(req, res) => {
    try {
        const ingredient = await Ingredient.findByPk(req.params.id);
        if (ingredient) {
            await ingredient.destroy();
            req.flash('success_msg', 'Інгредієнт видалено');
        }
    } catch (err) {
        req.flash('error_msg', 'Неможливо видалити інгредієнт, оскільки він використовується в рецептах');
    }
    res.redirect('/ingredients');
};
const { Category } = require('../models');
const { validationResult } = require('express-validator');

exports.getCategories = async(req, res) => {
    const categories = await Category.findAll();
    res.render('categories/index', {
        title: 'Керування категоріями',
        categories,
        errors: {},
        old: {},
    });
};

exports.createCategory = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const categories = await Category.findAll();
        return res.status(400).render('categories/index', {
            title: 'Керування категоріями',
            categories,
            errors: errors.mapped(),
            old: req.body,
        });
    }

    try {
        await Category.create({ name: req.body.name });
        req.flash('success_msg', 'Категорію створено');
    } catch (err) {
        req.flash('error_msg', 'Така категорія вже існує');
    }
    res.redirect('/categories');
};

exports.deleteCategory = async(req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (category) {
            await category.destroy();
            req.flash('success_msg', 'Категорію видалено');
        }
    } catch (err) {
        req.flash('error_msg', 'Неможливо видалити категорію, оскільки вона використовується в рецептах');
    }
    res.redirect('/categories');
};
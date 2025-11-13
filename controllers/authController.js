const bcrypt = require('bcryptjs');
const passport = require('passport');
const { validationResult } = require('express-validator');
const { User } = require('../models');

// Показати форму реєстрації
exports.showRegisterForm = (req, res) => {
    res.render('auth/register', { errors: {}, old: {} });
};

// Обробка реєстрації
exports.registerUser = async(req, res) => {
    const { username, email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).render('auth/register', {
            errors: errors.mapped(),
            old: req.body,
        });
    }

    try {
        const user = await User.findOne({ where: { email: email } });
        if (user) {
            req.flash('error_msg', 'Користувач з таким email вже існує');
            return res.redirect('/auth/register');
        }

        await User.create({ username, email, password }); // Пароль хешується хуком в моделі
        req.flash('success_msg', 'Ви успішно зареєструвалися і можете увійти');
        res.redirect('/auth/login');

    } catch (err) {
        console.error(err);
        res.status(500).send('Помилка сервера');
    }
};

// Показати форму входу
exports.showLoginForm = (req, res) => {
    res.render('auth/login');
};

// Обробка входу
exports.loginUser = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true,
    })(req, res, next);
};

// Обробка виходу
exports.logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success_msg', 'Ви вийшли з системи');
        res.redirect('/auth/login');
    });
};
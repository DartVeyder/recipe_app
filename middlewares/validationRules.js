const { body } = require('express-validator');

exports.registerRules = () => [
    body('username', 'Ім\'я користувача не може бути порожнім').notEmpty(),
    body('email', 'Будь ласка, введіть дійсну адресу електронної пошти').isEmail(),
    body('password', 'Пароль повинен містити щонайменше 6 символів').isLength({ min: 6 }),
    body('password2').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Паролі не співпадають');
        }
        return true;
    }),
];

exports.loginRules = () => [
    body('email', 'Будь ласка, введіть дійсну адресу електронної пошти').isEmail(),
    body('password', 'Пароль не може бути порожнім').notEmpty(),
];

exports.recipeRules = () => [
    body('title', 'Назва не може бути порожньою').notEmpty().trim(),
    body('description', 'Опис не може бути порожнім').notEmpty().trim(),
    body('instructions', 'Інструкції не можуть бути порожніми').notEmpty().trim(),
    body('categoryId', 'Необхідно вибрати категорію').isInt({ gt: 0 }),
];

exports.categoryRules = () => [
    body('name', 'Назва категорії не може бути порожньою').notEmpty().trim(),
];

exports.ingredientRules = () => [
    body('name', 'Назва інгредієнта не може бути порожньою').notEmpty().trim(),
];
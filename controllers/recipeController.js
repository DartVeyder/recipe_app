const { Recipe, Category, Ingredient, User } = require('../models');
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Показати всі рецепти
exports.getRecipes = async(req, res) => {
    try {
        const recipes = await Recipe.findAll({
            include: ['author', 'category'],
            order: [
                ['createdAt', 'DESC']
            ]
        });
        console.log(recipes);
        res.render('recipes/index', { title: 'Всі рецепти', recipes });
    } catch (err) {
        console.error(err);
        res.status(500).send('Помилка сервера');
    }
};

// Показати один рецепт
exports.getRecipe = async(req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id, {
            include: ['author', 'category', 'ingredients'],
        });
        if (!recipe) {
            req.flash('error_msg', 'Рецепт не знайдено');
            return res.redirect('/recipes');
        }
        res.render('recipes/show', { title: recipe.title, recipe });
    } catch (err) {
        console.error(err);
        res.status(500).send('Помилка сервера');
    }
};

// Показати форму створення
exports.showCreateForm = async(req, res) => {
    try {
        const categories = await Category.findAll();
        const ingredients = await Ingredient.findAll();
        res.render('recipes/form', {
            title: 'Створити рецепт',
            categories,
            ingredients,
            recipe: {},
            selectedIngredients: [],
            errors: {},
            old: {},
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Помилка сервера');
    }
};

// Створити рецепт
exports.createRecipe = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const categories = await Category.findAll();
        const ingredients = await Ingredient.findAll();
        // Якщо валідація не пройдена, видаляємо завантажений файл
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).render('recipes/form', {
            title: 'Створити рецепт',
            errors: errors.mapped(),
            old: req.body,
            categories,
            ingredients,
            recipe: {},
            selectedIngredients: req.body.ingredients || [],
        });
    }

    try {
        const { title, description, instructions, categoryId, ingredients } = req.body;

        const imageUrl = req.file ? '/uploads/' + req.file.filename : null;

        const recipe = await Recipe.create({
            title,
            description,
            instructions,
            categoryId,
            userId: req.user.id,
            image: imageUrl,
        });

        if (ingredients && ingredients.length) {
            await recipe.setIngredients(ingredients);
        }

        req.flash('success_msg', 'Рецепт успішно створено');
        res.redirect('/recipes');
    } catch (err) {
        console.error(err);
        res.status(500).send('Помилка сервера');
    }
};

// Показати форму редагування
exports.showEditForm = async(req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id, { include: 'ingredients' });
        if (!recipe) {
            req.flash('error_msg', 'Рецепт не знайдено');
            return res.redirect('/recipes');
        }

        // Перевірка прав доступу: тільки автор або адмін
        if (req.user.role !== 'admin' && recipe.userId !== req.user.id) {
            req.flash('error_msg', 'У вас немає прав редагувати цей рецепт');
            return res.redirect('/recipes');
        }

        const categories = await Category.findAll();
        const ingredients = await Ingredient.findAll();
        const selectedIngredients = recipe.ingredients.map(ing => ing.id);

        res.render('recipes/form', {
            title: 'Редагувати рецепт',
            recipe,
            categories,
            ingredients,
            selectedIngredients,
            errors: {},
            old: {},
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Помилка сервера');
    }
};

// Оновити рецепт
exports.updateRecipe = async(req, res) => {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe) {
        req.flash('error_msg', 'Рецепт не знайдено');
        return res.redirect('/recipes');
    }

    if (req.user.role !== 'admin' && recipe.userId !== req.user.id) {
        req.flash('error_msg', 'У вас немає прав редагувати цей рецепт');
        return res.redirect('/recipes');
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const categories = await Category.findAll();
        const ingredients = await Ingredient.findAll();
        req.body.id = req.params.id; // Для коректного action у формі
        // Якщо валідація не пройдена, видаляємо щойно завантажений файл
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        return res.status(400).render('recipes/form', {
            title: 'Редагувати рецепт',
            errors: errors.mapped(),
            old: req.body,
            recipe: {...req.body, image: recipe.image }, // Показуємо старе фото
            categories,
            ingredients,
            selectedIngredients: req.body.ingredients || [],
        });
    }

    try {
        const { title, description, instructions, categoryId, ingredients } = req.body;
        let imageUrl = recipe.image;

        if (req.file) {
            imageUrl = '/uploads/' + req.file.filename;

            // Видаляємо старий файл, якщо він існував
            if (recipe.image) {
                const oldImagePath = path.join(__dirname, '..', 'public', recipe.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        await recipe.update({ title, description, instructions, categoryId, image: imageUrl });

        if (ingredients && ingredients.length) {
            await recipe.setIngredients(ingredients);
        } else {
            await recipe.setIngredients([]);
        }

        req.flash('success_msg', 'Рецепт успішно оновлено');
        res.redirect(`/recipes/${recipe.id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Помилка сервера');
    }
};

// Видалити рецепт
exports.deleteRecipe = async(req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);
        if (!recipe) {
            req.flash('error_msg', 'Рецепт не знайдено');
            return res.redirect('/recipes');
        }

        if (req.user.role !== 'admin' && recipe.userId !== req.user.id) {
            req.flash('error_msg', 'У вас немає прав видаляти цей рецепт');
            return res.redirect('/recipes');
        }

        // Видаляємо зображення з сервера перед видаленням запису з БД
        if (recipe.image) {
            const imagePath = path.join(__dirname, '..', 'public', recipe.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await recipe.destroy();
        req.flash('success_msg', 'Рецепт видалено');
        res.redirect('/recipes');
    } catch (err) {
        console.error(err);
        res.status(500).send('Помилка сервера');
    }
};
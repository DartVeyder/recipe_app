const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const { recipeRules } = require('../middlewares/validationRules');
const upload = require('../middlewares/uploadMiddleware');

// Показати всі
router.get('/', recipeController.getRecipes);

// Створення
router.get('/new', ensureAuthenticated, recipeController.showCreateForm);
router.post('/', ensureAuthenticated, upload, recipeRules(), recipeController.createRecipe);


// Показати один
router.get('/:id', recipeController.getRecipe);

// Редагування
router.get('/:id/edit', ensureAuthenticated, recipeController.showEditForm);
router.put('/:id', ensureAuthenticated, upload, recipeRules(), recipeController.updateRecipe);

// Видалення
router.delete('/:id', ensureAuthenticated, recipeController.deleteRecipe);

module.exports = router;
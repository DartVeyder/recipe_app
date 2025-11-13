const express = require('express');
const router = express.Router();
const ingredientController = require('../controllers/ingredientController');
const { hasRole } = require('../middlewares/authMiddleware');
const { ingredientRules } = require('../middlewares/validationRules');

// Лише адміни можуть керувати інгредієнтами
router.get('/', hasRole(['admin']), ingredientController.getIngredients);
router.post('/', hasRole(['admin']), ingredientRules(), ingredientController.createIngredient);
router.delete('/:id', hasRole(['admin']), ingredientController.deleteIngredient);

module.exports = router;
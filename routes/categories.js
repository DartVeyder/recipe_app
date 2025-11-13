const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { hasRole } = require('../middlewares/authMiddleware');
const { categoryRules } = require('../middlewares/validationRules');

// Лише адміни можуть керувати категоріями
router.get('/', hasRole(['admin']), categoryController.getCategories);
router.post('/', hasRole(['admin']), categoryRules(), categoryController.createCategory);
router.delete('/:id', hasRole(['admin']), categoryController.deleteCategory);

module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerRules, loginRules } = require('../middlewares/validationRules');
const { forwardAuthenticated } = require('../middlewares/authMiddleware');

// Форма реєстрації
router.get('/register', forwardAuthenticated, authController.showRegisterForm);
router.post('/register', forwardAuthenticated, registerRules(), authController.registerUser);

// Форма входу
router.get('/login', forwardAuthenticated, authController.showLoginForm);
router.post('/login', forwardAuthenticated, loginRules(), authController.loginUser);

// Вихід
router.get('/logout', authController.logoutUser);

module.exports = router;
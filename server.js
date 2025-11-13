require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const nunjucks = require('nunjucks');
const path = require('path');
const methodOverride = require('method-override');
const routes = require('./routes'); // Головний файл маршрутів
const db = require('./models');

// Ініціалізація Passport
require('./config/passport')(passport);

const app = express();
const PORT = process.env.PORT || 3000;

// Налаштування шаблонізатора Nunjucks
const env = nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

// Додаємо глобальну функцію для перевірки ролі в шаблонах
env.addGlobal('hasRole', function(user, roles) {
    if (!user) return false;
    return roles.split(',').includes(user.role);
});

app.set('view engine', 'njk');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Method Override для PUT та DELETE
app.use(methodOverride('_method'));

// Express Session
app.use(session({
    secret: process.env.SESSION_SECRET || 'some_default_secret',
    resave: true,
    saveUninitialized: true,
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Глобальні змінні для шаблонів
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error'); // Для помилок Passport
    res.locals.user = req.user || null;
    res.locals.currentUrl = req.path;
    next();
});

// Маршрути
app.use('/', routes);

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
});
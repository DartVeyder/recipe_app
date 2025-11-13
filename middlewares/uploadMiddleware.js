// middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Налаштування сховища для файлів
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Файли будуть зберігатися в public/uploads/
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        // Генеруємо унікальне ім'я файлу, щоб уникнути конфліктів
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Фільтр для перевірки типу файлу (дозволяємо тільки зображення)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }
    cb('Помилка: Дозволено завантажувати лише файли зображень!');
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Обмеження розміру файлу 5MB
    fileFilter: fileFilter
});

// Експортуємо middleware для одного файлу
// 'recipeImage' - це ім'я поля <input type="file" name="recipeImage"> у формі
module.exports = upload.single('recipeImage');
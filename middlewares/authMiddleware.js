module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Будь ласка, увійдіть, щоб переглянути цей ресурс');
        res.redirect('/auth/login');
    },
    forwardAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    },
    hasRole: (roles) => {
        return (req, res, next) => {
            if (!req.user) {
                req.flash('error_msg', 'Спочатку потрібно увійти');
                return res.redirect('/auth/login');
            }
            if (!roles.includes(req.user.role)) {
                req.flash('error_msg', 'У вас немає дозволу на виконання цієї дії');
                return res.redirect('back');
            }
            next();
        };
    }
};
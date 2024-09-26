const jwt =  require('jsonwebtoken');

const requireAuth = (req, res, next) => {

    const token = req.cookies.authorized;

    jwt.verify(token, 'fleet', (err, decoded) => {
        if (err) {
            res.redirect('/login'); // Invalid token, redirect
        } else {
            console.log('Token is valid:', decoded);
            next(); // Proceed to the next middleware
        }
    });
};

module.exports = {
    requireAuth,
};

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

function authenticate(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

module.exports = authenticate;

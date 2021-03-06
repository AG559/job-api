const { BadRequestError } = require("../errors");
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new BadRequestError('No token provided!')
    }
    const token = authHeader.split(' ')[1]
    if (!token) {
        throw new BadRequestError('Token is invalid!')
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: decoded.userId, name: decoded.name }
        next();
    } catch (err) {
        throw new BadRequestError('Token is Invalid!')
    }
}

module.exports = auth;
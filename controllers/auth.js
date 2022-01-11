const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const { User } = require('../models/User');
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password!")
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new BadRequestError("No user created!")
    }
    const isVerify = await bcrypt.compare(password, user.password);
    if (!isVerify) {
        throw new UnauthenticatedError('Credential Invalid!')
    }
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })

}

const register = async (req, res) => {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

module.exports = {
    login, register
}
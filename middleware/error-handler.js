
const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
    let customError = {
        message: err.message || "Something went wrong,Please try agian later!",
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    }
    if (err.name == "ValidationError") {
        customError.statusCode = StatusCodes.BAD_REQUEST;
        customError.message = Object.values(err.errors).map((item) => item.message).join(',');
    }
    // cast Error
    if (err.name === "CastError") {
        customError.message = `No item found with this id : ${err.value}`;
        customError.statusCode = StatusCodes.BAD_REQUEST
    }
    // duplicate Error
    if (err.code === 11000) {
        customError.statusCode = StatusCodes.BAD_REQUEST;
        customError.message = `Duplicate Error is in ${Object.keys(err.keyValue)} Field!`
    }
    // return res.status(customError.statusCode).json(err)
    return res.status(customError.statusCode).json({ msg: customError.message })
}

module.exports = errorHandlerMiddleware;
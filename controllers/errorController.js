const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // name: err.name,
    error: err,
    stack: err.stack,
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  // const result = new AppError(message, 400);
  // console.log('the result is', result);
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const value = err.keyValue.name;
  // console.log(value);
  const message = `Duplicate field value ${value}. Please use another value.`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token.Please login again', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired.Please login again', 401);
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log('------', err);
  // console.log('---------', err.message);
  // console.log(err.status);
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // console.log(err);
    let error = { ...err, name: err.name };
    // console.log(error);
    // console.log(error.message);

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
      // console.log('------', error);
    }

    if (error.code === 11000) {
      error = handleDuplicateErrorDB(error);
      // console.log(error);
    }

    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
      // console.log(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }
    sendErrorProd(error, res);
  }
};

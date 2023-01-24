const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { promisify } = require('util');

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  // console.log(newUser);

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    },
  });
});

const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return res.status(200).json({
    status: 'success',
    token,
  });
};

const protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // console.log(token);

  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  // console.log(currentUser)

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exist', 401)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(
        'User recently changed their password. Please login again',
        401
      )
    );
  }
  req.user = currentUser;

  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have the permission to perform this action',
          403
        )
      );
    }

    next();
  };
};

module.exports = { signup, login, protect, restrictTo };

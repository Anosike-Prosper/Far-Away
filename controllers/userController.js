const User = require('../models/userModel');
const APIFeatures = require('../utils/apiFeatures.js');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getAllUser = catchAsync(async (req, res) => {
  const tours = await User.find({});

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

module.exports = { getAllUser, getUser, createUser, deleteUser, updateUser };

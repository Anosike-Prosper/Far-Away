const express = require('express');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

const {
  getAllUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/', getAllUser);
router.post('/', createUser);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;

const express = require('express');
const fs = require('fs');
const router = express.Router();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// console.log(tourRouter.router);

const { protect } = require('../controllers/authController');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTour,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');

router.get('/top-5-cheap', aliasTour, getAllTours);
router.get('/tour-stats', getTourStats);
router.get('/monthly-plan/:year', getMonthlyPlan);

router.get('/', protect, getAllTours);
router.post('/', createTour);
router.get('/:id', getTour);
router.patch('/:id', updateTour);
router.delete('/:id', deleteTour);

module.exports = router;

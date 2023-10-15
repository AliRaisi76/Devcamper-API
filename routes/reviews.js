const express = require('express')

const {
  getReviews,
  getReview,
  createReview,
} = require('../controllers/reviews')

const Review = require('../models/Review')

const router = express.Router({ mergeParams: true })

// advance Results middleware and Bootcamp model
// Route protector
const advancedResults = require('../middlewares/advancedResults')
const { protect, authorize } = require('../middlewares/auth')

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), createReview)

router.route('/:id').get(getReview)

module.exports = router

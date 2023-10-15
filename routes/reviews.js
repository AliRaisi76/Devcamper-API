const express = require('express')

const { getReviews } = require('../controllers/reviews')

const Review = require('../models/Review')

const router = express.Router({ mergeParams: true })

// advance Results middleware and Bootcamp model
// Route protector
const advancedResults = require('../middlewares/advancedResults')
const { protect, authorize } = require('../middlewares/auth')

router.route('/').get(
  advancedResults(Review, {
    path: 'bootcamp',
    select: 'name description',
  }),
  getReviews
)

module.exports = router

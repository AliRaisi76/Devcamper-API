const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')

// @Desc Get all courses
// @Route GET /api/v1/reviews
// @Route GET /api/v1/bootcamps/:bootcampId/reviews
// @Access Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId })

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

// @Desc Get single course
// @Route GET /api/v1/reviews
// @Access Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  })

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id ${req.params.id}`, 404)
    )
  }

  res.status(200).json({
    success: true,
    data: review,
  })
})

// @Desc Add review
// @Route POST /api/v1/bootcamp/:bootcampId/reviews
// @Access Private
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user.id

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found with the id ${req.params.bootcampId}`,
        404
      )
    )
  }

  const review = await Review.create(req.body)

  res.status(201).json({
    success: true,
    data: review,
  })
})

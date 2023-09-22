const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const Course = require('../models/Course')

// @Desc Get all courses
// @Route GET /api/v1/courses
// @Route GET /api/v1/bootcamps/:bootcampId/courses
// @Access Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query
  if (req.params.bootcampId) {
    console.log('hello')
    query = Course.find({ bootcamp: req.params.bootcampId })
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    })
  }

  const courses = await query

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  })
})

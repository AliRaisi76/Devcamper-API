const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')

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

// @Desc Get single course
// @Route GET /api/v1/courses/:id
// @Access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  })

  if (!course) {
    return next(
      new ErrorResponse(
        `Could not find course with the ID of: ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({
    success: true,
    data: course,
  })
})

// @Desc Create a bootcamp course
// @Route POST /api/v1/bootcamps/:bootcampId/courses
// @Access Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Could not find bootcamp with the ID of: ${req.params.bootcampId}`,
        404
      )
    )
  }

  const course = await Course.create(req.body)

  res.status(200).json({
    success: true,
    data: course,
  })
})

// @Desc Update course
// @Route PUT /api/v1/courses/:id
// @Access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id)

  if (!course) {
    return next(
      new ErrorResponse(
        `Could not find course with the ID of: ${req.params.id}`,
        404
      )
    )
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: course })
})

// @Desc Delete course
// @Route DELETE /api/v1/courses/:id
// @Access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)

  if (!course) {
    return next(
      new ErrorResponse(
        `Could not find course with the ID of: ${req.params.id}`,
        404
      )
    )
  }
  course.deleteOne()

  res.status(200).json({
    success: true,
    data: {},
  })
})
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')

// @Desc Get all courses
// @Route GET /api/v1/courses
// @Route GET /api/v1/bootcamps/:bootcampId/courses
// @Access Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = Course.find({ bootcamp: req.params.bootcampId })
    return res.status(200).json({
      success: true,
      count: (await courses).length,
      data: courses,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
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
  req.body.user = req.user.id

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Could not find bootcamp with the ID of: ${req.params.bootcampId}`,
        404
      )
    )
  }

  // make sure user is the bootcamp owner
  if (req.user.id.toString() !== bootcamp.user && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`,
        401
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

  // make sure user is the course owner
  if (req.user.id.toString() !== course.user && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update course ${course._id}`,
        401
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

  // make sure user is the course owner
  if (req.user.id.toString() !== course.user && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete course ${course._id}`,
        401
      )
    )
  }

  course.deleteOne()

  res.status(200).json({
    success: true,
    data: {},
  })
})

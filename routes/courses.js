const express = require('express')

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courses')

// advance Results middleware and Bootcamp model
const advancedResults = require('../middlewares/advancedResults')
const Course = require('../models/Course')

const router = express.Router({ mergeParams: true })

// Route protector
const { protect } = require('../middlewares/auth')

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, addCourse)
router
  .route('/:id')
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse)

module.exports = router

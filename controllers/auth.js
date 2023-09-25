const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const User = require('../models/User')

// @Desc Register User
// @Route GET /api/v1/auth/register
// @Access Public
exports.register = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
  })
})

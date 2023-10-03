const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const User = require('../models/User')

// @Desc Register User
// @Route POST /api/v1/auth/register
// @Access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body

  const user = await User.create({
    name,
    email,
    password,
    role,
  })

  sendTokenResponse(user, 201, res)
})

// @Desc User Login
// @Route POST /api/v1/auth/login
// @Access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email and password', 400))
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorResponse('Invalid Credentials', 401))
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password)
  if (!isMatch) {
    return next(new ErrorResponse('Invalid Credentials', 401))
  }

  sendTokenResponse(user, 200, res)
})
// Get token from model(document), create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken()

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  })
}

// @Desc Get current logged in user
// @Route GET /api/v1/auth/me
// @Access Private
exports.getMe = asyncHandler(async (req, res, next) => {})

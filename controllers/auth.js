const crypto = require('crypto')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const sendEmail = require('../utils/sendEmail')
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

// @Desc Get current logged in user
// @Route GET /api/v1/auth/me
// @Access Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id)

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @Desc Logout / Clear cookie
// @Route GET /api/v1/auth/logout
// @Access Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  })

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @Desc Update logged in user
// @Route PUT /api/v1/auth/updatedetails
// @Access Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: user,
  })
})

// @Desc Update current logged in user password
// @Route GET /api/v1/auth/updatepassword
// @Access Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password')

  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Password Invalid', 401))
  }

  user.password = req.body.newPassword
  await user.save()
  sendTokenResponse(user, 200, res)
})

// @Desc Forgot password
// @Route GET /api/v1/auth/forgotpassword
// @Access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new ErrorResponse('There is no user whith that email', 404))
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  // create reset URL
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

  try {
    console.log('test')
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    })
    res.status(200).json({
      success: true,
      data: 'Email sent',
    })
  } catch (err) {
    console.log(err)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save({ validateBeforeSave: false })

    return next(new ErrorResponse('Email could not be sent', 500))
  }
})

////////////THIS CONTROLLER NEEDS ENOUGH ATTECNTION AND ERROR HANDLING STUFF
// error handling if user doesnt send new password
// error habdle if there wasnt a resettoken in the params
// @Desc Reset Password
// @Route PUT /api/v1/auth/resetpassword/:resettoken
// @Access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get token from url and hash it
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(new ErrorResponse('Invalid Token', 400))
  }

  // Set new password
  if (!req.body.password) {
    return next(new ErrorResponse('Please set a password', 400))
  }
  user.password = req.body.password
  user.resetPasswordExpire = undefined
  user.resetPasswordToken = undefined
  user.save()

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

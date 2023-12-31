const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const User = require('../models/User')

// @Desc Get all users
// @Route GET /api/v1/users
// @Access Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @Desc Get single user
// @Route GET /api/v1/users/:id
// @Access Public/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return next(new ErrorResponse('No user with this Id was found', 404))
  }
  res.status(200).json({
    success: true,
    data: user,
  })
})

// @Desc Create user
// @Route POST /api/v1/users/
// @Access Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body)

  res.status(201).json({
    success: true,
    data: user,
  })
})

// @Desc Update user
// @Route PUT /api/v1/users/:id
// @Access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(201).json({
    success: true,
    data: user,
  })
})

// @Desc Delete user
// @Route DELETE /api/v1/users/:id
// @Access Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id)

  res.status(201).json({
    success: true,
    data: {},
  })
})

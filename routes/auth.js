const express = require('express')
const User = require('../models/User')
const {
  register,
  login,
  getMe,
  forgotPassword,
} = require('../controllers/auth')

const { protect } = require('../middlewares/auth')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/getMe', protect, getMe)
router.post('/forgotPassword', forgotPassword)

module.exports = router

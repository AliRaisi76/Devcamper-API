const express = require('express')
const User = require('../models/User')
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth')

const { protect } = require('../middlewares/auth')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/getMe', protect, getMe)
router.post('/forgotpassword', forgotPassword)
router.put('/resetpassword/:resettoken', resetPassword)

module.exports = router

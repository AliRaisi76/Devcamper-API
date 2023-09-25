const express = require('express')
const User = require('../models/User')
const { register } = require('../controllers/auth')

const router = express.Router()

router.post('/register', register)

module.exports = router

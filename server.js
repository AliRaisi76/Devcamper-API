const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const colors = require('colors')

// Load error handler middlewares
const errorHandler = require('./middlewares/error')

// Load config vars
dotenv.config({ path: './config/config.env' })

// Load DB connection file
const connectDB = require('./config/db')

// Load route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')
const auth = require('./routes/auth')
const users = require('./routes/users')
const reviews = require('./routes/reviews')

connectDB()

const app = express()

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// file uploader
app.use(fileupload())

// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Mount Routes
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth', auth)
app.use('/api/v1/users', users)
app.use('/api/v1/reviews', reviews)

// Use errorHandler as middelware
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow
      .bold
  )
)

// Handle Unhandled Rejections and close the server and exit the process
process.on('unhandledRejection', (reason, promise) => {
  console.log(
    `Unhandled Rejection. Reason: ${reason.message}, Promise: ${promise}`.red
  )
  // Close server & exit process
  server.close(() => process.exit(1))
})

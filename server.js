const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')

// Load error handler middlewares
const errorHandler = require('./middlewares/error')

// Load DB connection file
const connectDB = require('./config/db')

// Load route files
const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')

// Load config vars
dotenv.config({ path: './config/config.env' })

connectDB()

const app = express()

// Body parser
app.use(express.json())

// Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// Mount Routes
app.use('/api/v1/bootcamps', bootcamps)
app.use('/api/v1/courses', courses)

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

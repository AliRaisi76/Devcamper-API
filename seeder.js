const fs = require('fs')
const mongoose = require('mongoose')
const colors = require('colors')
const dotenv = require('dotenv')

// if we had the DB authentications in .env file we had to load the env vars
dotenv.config({ path: './config/config.env' })

// Load the Models
const Bootcamp = require('./models/Bootcamp')

// Connect to DB
mongoose.connect('mongodb://127.0.0.1:27017/devcamper')

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
)

// Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps)
    console.log('Data imported...'.green.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

// Delete Data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany()
    console.log('Data deleted...'.red.inverse)
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

if (process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  deleteData()
}

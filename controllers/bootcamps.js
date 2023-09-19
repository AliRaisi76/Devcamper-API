const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middlewares/async')
const Bootcamp = require('../models/Bootcamp')
const opencage = require('opencage-api-client')

// @Desc Get all bootcamps
// @Route GET /api/v1/bootcamps
// @Access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find()

  res.status(200).json({
    success: true,
    counts: bootcamps.length,
    data: bootcamps,
  })
})

// @Desc Get bootcamp
// @Route GET /api/v1/bootcamps/:id
// @Access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Could not find bootcamp with the ID of: ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({
    success: true,
    data: bootcamp,
  })
})

// @Desc Create bootcamp
// @Route POST /api/v1/bootcamps
// @Access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body)

  res.status(201).json({
    success: true,
    data: bootcamp,
  })
})

// @Desc Update bootcamp
// @Route PUT /api/v1/bootcamps/:id
// @Access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Could not find bootcamp with the ID of: ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({ success: true, data: bootcamp })
})

// @Desc Delete bootcamp
// @Route DELETE /api/v1/bootcamps/:id
// @Access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Could not find bootcamp with the ID of: ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @Desc Bootcamps in radius
// @Route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @Access Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params
  // Get lat and lng
  const data = await opencage.geocode({ q: zipcode })

  let place

  if (data.status.code === 200 && data.results.length > 0) {
    // Get the first result
    place = data.results[0]
    // Print the zipcode
    console.log(place.components.postcode)
    // Print the latitude and longitude
    console.log(place.geometry)
  } else {
    // Handle errors
    console.log('Status', data.status.message)
  }

  const placeGeometry = place.geometry
  // radius by earth radius by Km
  const radius = distance / 6378
  console.log(Object.values(placeGeometry).reverse())
  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: {
        $centerSphere: [Object.values(placeGeometry).reverse(), radius],
      },
    },
  })

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  })
})

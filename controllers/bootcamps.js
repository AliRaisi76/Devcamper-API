const Bootcamp = require('../models/Bootcamp')

// @Desc Get all bootcamps
// @Route GET /api/v1/bootcamps
// @Access Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find()

    res.status(200).json({
      success: true,
      counts: bootcamps.length,
      data: bootcamps,
    })
  } catch (err) {
    res.status(400).json({
      success: false,
    })
  }
}

// @Desc Get bootcamp
// @Route GET /api/v1/bootcamps/:id
// @Access Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id)

    if (!bootcamp) {
      return res.status(400).json({
        success: false,
      })
    }

    res.status(200).json({
      success: true,
      data: bootcamp,
    })
  } catch (err) {
    res.status(400).json({
      success: false,
    })
  }
}

// @Desc Create bootcamp
// @Route POST /api/v1/bootcamps
// @Access Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body)

    res.status(201).json({
      success: true,
      data: bootcamp,
    })
  } catch (err) {
    res.status(400).json({
      success: false,
    })
  }
}

// @Desc Update bootcamp
// @Route PUT /api/v1/bootcamps/:id
// @Access Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!bootcamp) {
      return res.status(400).json({
        success: false,
      })
    }

    res.status(200).json({ success: true, data: bootcamp })
  } catch (err) {
    res.status(400).json({
      success: false,
    })
  }
}

// @Desc Delete bootcamp
// @Route DELETE /api/v1/bootcamps/:id
// @Access Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!bootcamp) {
      return res.status(400).json({
        success: false,
      })
    }

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    res.status(400).json({
      success: false,
    })
  }
}

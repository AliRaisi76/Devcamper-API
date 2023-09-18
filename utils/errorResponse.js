class ErrorResponse extends Error {
  constructor(message, statusCode) {
    // we add the message to the super class' constructor propertties
    super(message)
    // We add a new property to the new made clalss called statusCode
    this.statusCode = statusCode
  }
}

module.exports = ErrorResponse

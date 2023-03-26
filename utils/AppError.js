class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.statusText = `${status}`.startsWith("4")
      ? "Bad Request"
      : "Internal Server Error";

    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

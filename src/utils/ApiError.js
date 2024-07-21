// Define the ApiError class that extends the built-in Error class
class ApiError extends Error {
  // The constructor method to initialize the ApiError instance
  constructor(
    // Parameters for the constructor with default values
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "" // Optional stack trace, default is an empty string
  ) {
    // Call the parent class's constructor with the message
    super(message);

    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    // Set the stack trace if provided, otherwise capture the current stack trace
    if (stack) {
      this.stack = stack;
    } else {
      // Capture the current stack trace, excluding the constructor call
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

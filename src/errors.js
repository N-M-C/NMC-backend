class HttpError extends Error {
  constructor({ message, statusCode }, ...arg) {
    super(message, ...arg);

    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}

class NotAuthenticatedError extends HttpError {
  constructor(options) {
    super({
      message: '인증되지 않았습니다.',
      statusCode: 401,
      ...options,
    });
  }
}

class UnMatchedParams extends HttpError {
  constructor(options) {
    super({
      message: 'Request Body Parameter 값 형식이 일치하지 않습니다.',
      statusCode: 403,
      ...options,
    });
  }
}

module.exports = {
  NotAuthenticatedError,
};

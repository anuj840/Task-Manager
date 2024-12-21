// middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Rate limit for sensitive endpoints like login and task creation
const sensitiveRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,  // Max 5 requests per 5 minutes
  statusCode: 429, // Status code for rate limiting
  message: {
    status: 'error',
    message: 'Too many attempts, please try again later.',
  },
  handler: (req, res, next, options) => {
    // Custom JSON response when rate limit is exceeded
    res.status(options.statusCode).json({
      status: 'error',
      message: options.message.message,
      retryAfter: Math.ceil(options.windowMs / (1000 * 60)), // Convert milliseconds to minutes
    });
  },
});

// General rate limit for non-sensitive endpoints
const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per 15 minutes
  statusCode: 429, // Status code for rate limiting
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.',
  },
  handler: (req, res, next, options) => {
    // Custom JSON response when rate limit is exceeded
    res.status(options.statusCode).json({
      status: 'error',
      message: options.message.message,
      retryAfter: Math.ceil(options.windowMs / (1000 * 60)), // Convert milliseconds to minutes
    });
  },
});

// Admin/Manager-specific rate limit for task management actions
const adminManagerRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Max 200 requests per 15 minutes
  statusCode: 429, // Status code for rate limiting
  message: {
    status: 'error',
    message: 'Too many requests, please try again later.',
  },
  handler: (req, res, next, options) => {
    // Custom JSON response when rate limit is exceeded
    res.status(options.statusCode).json({
      status: 'error',
      message: options.message.message,
      retryAfter: Math.ceil(options.windowMs / (1000 * 60)), // Convert milliseconds to minutes
    });
  },
});

module.exports = {
  sensitiveRateLimit,
  generalRateLimit,
  adminManagerRateLimit,
};

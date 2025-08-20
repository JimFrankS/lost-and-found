import logger from '../utility/logger.utility.js';

/**
 * Return a shallow-cloned metadata object with common sensitive fields masked.
 *
 * Masks common secrets found in meta.body and meta.headers so they are safe for logging.
 * Note: cloning is shallow — nested objects (e.g., meta.body, meta.headers) are not deep-copied,
 * so their properties may be mutated on the original object.
 *
 * @param {object} meta - Metadata object that may contain `body` and `headers`.
 * @returns {object} A shallow clone of `meta` with sensitive fields replaced by `"[HIDDEN]"`.
 *                  Fields masked: body.password, body.token, body.email, body.authorization,
 *                  and headers.authorization.
 */
function maskSensitiveInfo(meta) {
  // Add or remove sensitive fields as needed
  const clone = { ...meta };
  if (clone.body) {
    if (clone.body.password) clone.body.password = '[HIDDEN]';
    if (clone.body.token) clone.body.token = '[HIDDEN]';
    if (clone.body.email) clone.body.email = '[HIDDEN]';
    if (clone.body.authorization) clone.body.authorization = '[HIDDEN]';
  }
  if (clone.headers && clone.headers.authorization) clone.headers.authorization = '[HIDDEN]';
  // Add more as needed
  return clone;
}

/**
 * Express error-handling middleware.
 * Logs detailed error info with sensitive fields masked, returns safe error response.
 */
const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  // Set status code before logging for accuracy
  let statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  // Handle known error types (example: validation errors)
  if (err.name === 'ValidationError') {
    statusCode = 400;
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
  }

  res.status(statusCode);

  // Prepare metadata for logging
  const metadata = maskSensitiveInfo({
    timestamp: new Date().toISOString(),
    requestId: req.requestId,
    path: req.originalUrl,
    method: req.method,
    status: statusCode,
    message: err.message,
    stack: err.stack,
    user: req.user ? (req.user.email || req.user.id || '[unknown]') : undefined,
    ip: req.ip,
    query: req.query,
    params: req.params,
    body: req.body,
    headers: req.headers,
  });

  // Log the error
  logger.error('Unhandled error', metadata);

  // Respond with error (never leak sensitive info)
  res.json({
    success: false,
    message: isProduction ? 'Internal Server Error' : err.message || 'Internal Server Error',
    ...(isProduction ? {} : { stack: err.stack }),
    requestId: req.requestId,
    status: statusCode,
  });
};

export default errorHandler;
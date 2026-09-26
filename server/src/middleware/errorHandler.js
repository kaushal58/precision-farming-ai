import logger from '../config/logger.js';

const errorHandler = (err, req, res, _next) => {
  logger.error(err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;

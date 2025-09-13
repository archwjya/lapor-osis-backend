const logger = require('../utils/logger');

function requestLogger(req, res, next) {
  logger.request(`${new Date().toISOString()} ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
  next();
}

function errorLogger(err, req, res, next) {
  logger.error(`${new Date().toISOString()} ${err.message} ${req.method} ${req.url}`);
  res.status(500).json({ error: err.message });
}

module.exports = { requestLogger, errorLogger };

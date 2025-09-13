const fs = require('fs');
const path = require('path');
const logDir = process.env.LOG_DIR || './logs';

function logToFile(filename, message) {
  const filePath = path.join(logDir, filename);
  fs.appendFile(filePath, message + '\n', err => {
    if (err) console.error('Logging error:', err);
  });
}

module.exports = {
  request: msg => logToFile('requests.log', msg),
  error: msg => logToFile('errors.log', msg),
  bot: msg => logToFile('bot.log', msg)
};

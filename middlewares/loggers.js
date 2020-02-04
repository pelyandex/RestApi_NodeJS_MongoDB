const fs = require('fs');
const path = require('path');
const eol = require('os').EOL;

module.exports.requestLog = (req, res, next) => {
  const filepath = path.join(__dirname, 'request.log');
  const data = `${eol}${JSON.stringify({
    urL: req.url,
    method: req.method,
    time: new Date().toLocaleString('ru'),
  })}`;
  fs.appendFile(filepath, data, (err) => {
    if (err) next(err);
  });
  next();
};

module.exports.errorLog = (error) => {
  const filepath = path.join(__dirname, 'error.log');
  const data = `${eol}${JSON.stringify({
    err: error.statusCode,
    message: error.message,
    time: new Date().toLocaleString('ru'),
  })}`;
  fs.appendFile(filepath, data, (err) => {
    if (err) console.log(err);
  });
};

module.exports.dataBaseStatus = (status) => {
  const filepath = path.join(__dirname, 'status.log');
  const data = `${eol}${JSON.stringify({
    status,
    time: new Date().toLocaleString('ru'),
  })}`;
  fs.appendFile(filepath, data, (err) => {
    if (err) console.log(err);
  });
};

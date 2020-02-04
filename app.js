const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { celebrate, errors } = require('celebrate');
const routes = require('./routes');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLog, errorLog, dataBaseStatus } = require('./middlewares/loggers');
const { validateSignIn, validateSignUp } = require('./middlewares/celebrateConfig');

const { PORT = 3000 } = process.env;
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', (err) => {
  dataBaseStatus(err);
  process.exit(2);
});
mongoose.connection.on('connected', () => {
  dataBaseStatus('Succesfully connected to MongoDB Database');
});

app.use(requestLog);
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
// На сервере блок с краш-тестом выглядит именно так
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate(validateSignIn), login);
app.post('/signup', celebrate(validateSignUp), createUser);

app.use(auth);
app.use('/', routes);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (next) {
    res
      .status(statusCode)
      .send({
        message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
      });
  }
  errorLog(err);
});

app.listen(PORT, () => {
  dataBaseStatus(`App listening on port ${PORT}`);
});

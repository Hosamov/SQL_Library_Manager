
const sequelize = require('./models').sequelize;

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
//const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//setup static middleware to serve static files in the public folder
app.use('/static', express.static('public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter); //route to routes/index.js
//app.use('/users', usersRouter);

//404 error handler
app.use((req, res, next) => {
  //Create a new the error class object
  const err = new Error()
  err.message = `It appears the page you requested doesn't exist.`;
  err.status = 404; //set status property to 404

  //log out the error code, and stack to the console, including message
  console.log('Error status code: ' + err.status);
  console.log(err.stack);

  //render the page-not-found template
  res.status(404).render('page-not-found'); //display a generic 404 page without error stack
});

//global error handler
app.use((err, req, res, next) => {
  if(err) {
    if(err.status === 404) {
       res.status(404).render('page-not-found', { err }); //render the error status with the error stack
    } else {
      err.message = err.message; //|| "Oops, it looks like something went wrong on the server...";
      res.status(err.status || 500).render('error', { err }); //display the error status and render the error template w/ error message/object
      console.log(err.status);
      console.log(err.message);
    }
  }
});

module.exports = app;

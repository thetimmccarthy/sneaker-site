var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
var cors = require('cors');
var session = require('express-session');
var mongoDBStore = require('connect-mongodb-session')(session);

const mongoose = require('mongoose')
const mongodbstring = process.env.MONGO_DB;
mongoose.connect(mongodbstring, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connnection error'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var itemsRouter = require('./routes/item')
var categoryRouter = require('./routes/category')
var loginRouter = require('./routes/login');
var registerRouter = require('./routes/register');
var userModel = require('./models/user');

var app = express();

var store = new mongoDBStore({
  uri: process.env.MONGO_DB,
  collection: 'sessions'
});

store.on('error', (error) => {
  console.error(error);
})

// TODO: May need to add check to see if prod or dev
app.use(session({
  secret: 'THISISTHESECRET',
  cookie: {
    maxAge: 1000*60*60*2
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));

app.use('/', function(req, res, next) {
  if (req.session.username) {
    userModel.find({'username': req.session.username}).exec((err, result) => {
      if(err) {
        console.error(err);
      } else {
        let id = result[0]._id;
        res.locals.session = {
          username: req.session.username,
          id: id
        }
      }      
    })
  }
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, '/public')));
// app.use(cors);

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/item', itemsRouter)
app.use('/category', categoryRouter)
app.use('/login', loginRouter)
app.use('/register', registerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



// app.use(getSessionUserId);


module.exports = app;

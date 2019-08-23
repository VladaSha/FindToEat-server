require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const cors = require('cors');

var app = express();

app.use(session({
  secret: 'super secret',
  cookie: { maxAge: 600000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  }),
  resave: false,
  saveUninitialized: true
}))

app.use(cors({
  origin: true,
  credentials: true
}));

// Connection to the database
mongoose.connect(process.env.DB, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to Mongo!');
  }).catch(err => {
    console.error('Error connecting to mongo', err);
  });
mongoose.set('useFindAndModify', false);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//protected routes
let protectedRoute = (req, res, next) => {
  debugger
  if(!req.session.currentUser)
   next(createError(403))
  else
   next()
}

app.use('/api/auth', require('./routes/login'));
app.use('/api/auth', require('./routes/logout'));
app.use('/api/auth', require('./routes/signup'));
app.use('/api', protectedRoute, require('./routes/saveToFav'))
// app.use('/profile', protectedRoute, require('./routes/profile'));

app.use((req, res, next) => {
  // If no routes match, send them the React HTML.
  res.sendFile(__dirname + "/public/index.html");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  debugger
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message)
  //check in "catch" in every axios request
  //check the message and if it's "Unauthorized" or something like that (check the actual message you get),
  //then redirect to login (this.props.history.push("/auth/login"))
});

module.exports = app;

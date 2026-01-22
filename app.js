var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var userRouter = require('./routes/userRoutes');
var cartRouter = require('./routes/cartRoutes');
var productRouter = require('./routes/product');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const mongoose = require('mongoose');

// ✅ MongoDB connection (SAFE)
mongoose.connect('mongodb://127.0.0.1:27017/user')
.then(() => {
    console.log('MongoDB connected');
    
    // ✅ Test Product model
    const Product = require('./model/Product');
    console.log('✅ Product model loaded:', Product);
})
.catch(err => console.error('MongoDB error:', err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/', indexRouter);
app.use('/api/users',userRouter);
app.use('/cart', cartRouter);
app.use('/product', productRouter);
app.use('/users', usersRouter);

// catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

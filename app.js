const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit=require('express-rate-limit');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const AppError=require('./utils/appError');
const globalErrorHandler= require('./controllers/errorController');
const tourRouter=require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
// console.log(AppError);

const app = express();

// 1) GLOBAL MIDDLEWARES
//SET Security HTTP headers
app.use(helmet())

//DEVELOPMENT logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
//LIMIT REQUEST FROM SAME API
const limiter= rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:'Too many request from this IP,please try again in an hour!',
   
});
app.use('/api',limiter);

//BODY parser,reading data from the body into req.body
app.use(express.json({limit:'10kb'}));

//data sanitization against NoSQL
app.use(mongoSanitize());

//data sanitization against XSS
app.use(xss());

//Serving static files
app.use(express.static(`${__dirname}/public`));


//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*',(req,res,next)=>{
  next(new AppError(`can't find ${req.originalUrl}`,404));

});
app.use(globalErrorHandler);

module.exports = app;

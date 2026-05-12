const {promisify}=require('util');
const jwt=require('jsonwebtoken');
const User=require('./../models/userModel');
const catchAsync=require('./../utils/catchAsync');
const AppError=require('./../utils/appError');

const signToken=id =>{
    return jwt.sign({id: id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    });
}

const  createSendToken =(user,statusCode,res)=>{
    const token=signToken(user._id);

    res.status(statusCode).json({
        status:'Success',
        token,
        data:{
            user:user,
        }
    });
}

exports.signup = catchAsync( async (req,res,next)=>{
    const newUser=await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        passwordConfirm:req.body.passwordConfirm,
    })
    createSendToken(newUser,201,res);
   
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Check if user exists && password is correct
    const user=await User.findOne({email}).select('+password');
    
    if(!user|| !(await user.correctPassword(password,user.password))){
        return next(new AppError('Incorrect email or password',401));

    }

  // 3) If everything ok, send token

 
    createSendToken(user,200,res);
});


exports.protect= catchAsync(async (req,res,next)=>{
    // 1) Getting Token and Check if it's there
            let token;
          if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
             token=req.headers.authorization.split(' ')[1];
          }
        //   console.log(token);
          if(!token){
            return next(new AppError('You are not logged in Please login to get access',401));
          }
    // 2) Verification of token
       const decoded= await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    //    console.log(decoded);
    // 3) Check if user still exist.
       const freshUser= await User.findById(decoded.id);
        if(!freshUser){
            return next(new AppError('The user belonging to this token does not exits',401));
        }
    // 4) Check if user changed password after the JWT was issued
        if(freshUser.changePasswordAfter(decoded.iat)){
            return next(new AppError('User recently changed password please login again',401));
        }
        req.user=freshUser;
        next();
});

exports.restrictTo= (...roles) => {
    return (req,res,next)=>{
        //roles ['admin','lead-guide']
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action',403));

        }
        next();

    };
};

exports.forgotPassword=catchAsync(async (req,res,next) =>{
    // 1) Get User based on posted email
        const user=await User.findOne({email:req.body.email})
        if(!user){
            return next(new AppError('There is no user with email address',404));
        }

    // 2) generate the random reset token
        const resetToken= user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false});

    // 3) send it to user's email
});
exports.resetPassword=(req,res,next) =>{

}
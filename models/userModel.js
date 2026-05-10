const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');

//name,email,photo,password,passConfirm
const userSchema=new mongoose.Schema({
    name :{
        type:String,
        required:[true,'Please tell us your name'],

    },
    email:{
        type:String,
        required:[true,"Please tell us your email"],
        unique:true,
        lowercase:true,
        validator:[validator.isEmail,'provide a valid email']
    },
    photo:{
        type:String
    },
    password:{
        type:String,
        required:[true,'please provide a password'],
        minlength:8,
        select:false,
    },
    passwordConfirm:{
        type:String,
        required:[true,'please confirm password'],
        validate:{
            //this only wokrs on create and save
            validator:function(el){
                return el===this.password;
            },
            message:'Passwords are not same ',
        },

    }

});

userSchema.pre('save',async function(next){
    //only run this function if password was actually modified
    if (!this.isModified('password'))return next();
    //hash the passwrod with the hash of 12
    this.password=await bcrypt.hash(this.password,12);
    this.passwordConfirm=undefined;
    next();
});
userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}

const User=mongoose.model('User',userSchema);

module.exports=User;
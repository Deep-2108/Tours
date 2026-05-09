const mongoose=require('mongoose');
const validator=require('validator');
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
        minlength:8
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
})

const User=mongoose.model('User',userSchema);

module.exports=User;
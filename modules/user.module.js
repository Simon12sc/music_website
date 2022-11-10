import mongoose from "mongoose";
const {Schema,model}=mongoose;
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcryptjs"
import crypto from "crypto"

const userSchema=new Schema({
    name:{
        type:String,
        required:[true,"eplease enter the title of product"],
    },
    profile:{
        type:String,
        required:[true,"please enter your description of your music"]
    },
    email:{
        type:String,
        required:[true,"enter your music or story here"],
        unique:[true,"this email have been already used..."],
        validate:[validator.isEmail,"enter a valid email please.."]
    },
    password:{
        type:String,
        required:[true,"enter your password.."],
        minLength:[8,"password should be greater than 8 characters"],
        select:false
    },
    role:{
        type:String,
        default:"user",
        required:true
    },
    resetPassword:{
        type:String,
    },
    resetPasswordExpire:{
        type:Date
    },

},{timestamps:true})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password=await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.comparePassword=async function(password){
    console.log(this.password)
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.getJwtToken=function (){
    return jwt.sign({id:this._id},process.env.JWT_KEY,{expiresIn:process.env.JWT_EXPIRE});
}

userSchema.methods.getResetToken=async function (){
    let token=crypto.randomBytes(20).toString("hex");
    this.resetPassword=crypto.createHash("sha256").update(token).digest("hex");
    this.resetPasswordExpire=Date.now()+15*60*1000
    return token;
}
const User=model("User",userSchema);
export default User;
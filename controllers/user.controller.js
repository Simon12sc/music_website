import ErrorHandler from "../errors/error.handler.js";
import handleTryCatch from "../errors/handleTryCatch.js";
import sendToken from "../features/sendToken.js";
import User from "../modules/user.module.js";
import fs from "fs";
import { sendMail } from "../features/sendMail.js";
import crypto from "crypto"

export const registerUser=handleTryCatch(async (req,res,next)=>{
    try{
        const user=await User.create({name:req.body.name,email:req.body.email,password:req.body.password,profile:req.file.path.split('\\').join("/")});
        sendToken(user,200,res);
    }catch(error){
    fs.unlink(req.file.path,(err)=>{if(err){console.log(err)}});
    return next(new ErrorHandler(error,401))        
    }
        
    })

export const login=handleTryCatch(async (req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){return next(new ErrorHandler("enter your id and password",400))}
    
    const user=await User.findOne({email}).select("+password");
    if(!user){return next(new ErrorHandler("enter email and password correctly !!",401))}
    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){return next(new ErrorHandler("enter email and password correctly !!",401))}
    sendToken(user,200,res);
})

export const logout=handleTryCatch(async(req,res,next)=>{
    res.cookie("token","",{httpOnly:true,expires:0}).status(200).json({success:true,message:"logged out successfully"})
})


export const getAllUser=handleTryCatch(async(req,res,next)=>{
    const users=await User.find();
    const usersLength=users.length;
    res.status(200).json({success:true,users,length:usersLength});
})


export const getMyInfo=handleTryCatch(async (req,res,next)=>{
    const id=req.user._id.toString();
    if(!id){return next(new ErrorHandler("Please login first...",401))}
    const user=await User.findById(id);
    if(!user){return next(new ErrorHandler("User doesn't exist..."))}
    res.status(200).json({success:true,user})
})


export const deleteMe=handleTryCatch(async (req,res,next)=>{
    const {oldPassword}=req.body;
    if(!oldPassword){return next(new ErrorHandler("please enter your old password....",401))}
    if(!req.user){return next(new ErrorHandler("please login first....",401))}
    const id=req.user._id.toString();
    let user=await User.findById(id).select("+password");
    if(!user){return next(new ErrorHandler("User doesn't exist..."))}
    
    const isPasswordMatched=await user.comparePassword(oldPassword);
    
    if(!isPasswordMatched){return next(new ErrorHandler("Wrong password !!",401))}
    
    fs.unlink(user.profile,(err)=>{if(err){console.log(err)}})
    user.remove();
    res.status(200).json({success:true,message:"User deleted successfully"});

})


export const deleteUser=handleTryCatch(async (req,res,next)=>{
    const {id}=req.body;
    if(!id){return next(new ErrorHandler("please enter id....",401))}
    let user=await User.findById(id);
    if(!user){return next(new ErrorHandler("User doesn't exist..."))}

    fs.unlink(user.profile,(err)=>{if(err){console.log(err)}})
    user.remove();
    res.status(200).json({success:true,message:"User deleted successfully"});

})


export const updateMyProfile=handleTryCatch(async (req,res,next)=>{
    const user=req.user;
    if(!user){return next(new ErrorHandler("please login first...",404))};
    const id=req.user._id.toString();
    const {email,name}=req.body;
    if(!email || !name){return next(new ErrorHandler("enter your email and name please",400))};
    
    let myDetail=await User.findByIdAndUpdate(id,{email,name},{new:true,runValidators:true,useFindAndModify:false});
    res.status(200).json({success:true,user:myDetail});
})

export const changeMyPassword=handleTryCatch(async(req,res,next)=>{
    const isUser=req.user;
    if(!isUser){return next(new ErrorHandler("please login first...",404))};
    const id=req.user._id.toString();
    const {oldPassword,confirmPassword,newPassword}=req.body
    
    if(!oldPassword||!confirmPassword|| !newPassword){return next(new ErrorHandler("old password, new password and confirm password required...",404))}
    if(confirmPassword!==newPassword){return next(new ErrorHandler("newPassword and confirm new password doesn't match",404))}

    const user=await User.findById(id).select("+password");
    if(!user){return next(new ErrorHandler("user not found please login again.",404))}

    const isOldPasswordMatched=await user.comparePassword(oldPassword);

    if(!isOldPasswordMatched){return next(new ErrorHandler("enter your old password correctly..",400))}

    user.password=newPassword;
    await user.save();

    sendToken(user,200,res);
})

export const updateProfilePicture=handleTryCatch(async (req,res,next)=>{
    const isUser=req.user;
    if(!isUser){return next(new ErrorHandler("please login first....",400))}
    const id=isUser._id.toString();
    if(!req.file){return next(new ErrorHandler("image is requried to change ..."))}
    const user=await User.findById(id);
    fs.unlink(user.profile,(err)=>{if(err){console.log(err)}})
    user.profile=req.file.path.split("\\").join("/");
    user.save({validateBeforeSave:false});
    res.status(200).json({success:true,message:"profile changed..."})
})

export const forgetPassword=handleTryCatch(async (req,res,next)=>{
    const {email}=req.body;
    if(!email){return next(new ErrorHandler("email is required to reset your password.",401))}
    
    const user=await User.findOne({email});
    if(!user){return next(new ErrorHandler("user not found...",401))}

    let resetToken=await user.getResetToken();
    await user.save({validateBeforeSave:false});
    const resetLink=`${req.protocol}://${req.get("host")}/api/v1/user/password/reset/${resetToken}`;
    console.log(resetLink)
    const message=`<h1>this is email to you for reset your password click the button: </h1><a href="${resetLink}"><button >Reset Password</button></a>`
    try{

        await sendMail({email:email,subject:"reset password link:",message})
        res.status(200).json({success:true,message:`email sent to ${email}`})

    }catch(err){
        user.resetPassword=undefined
        user.resetPasswordExpire=undefined
        await user.save({validateBeforeSave:false})
        return next(new ErrorHandler(err,400));
    }

})


export const sendChangePasswordPage=handleTryCatch(async(req,res,next)=>{
    //we will render the page to change password
})

export const resetPassword=handleTryCatch(async(req,res,next)=>{
     const {token}=req.params;
     const {newPassword,confirmPassword}=req.body
     if(!newPassword || !confirmPassword){return next(new ErrorHandler("required new password and confirm password",400))}
     if(newPassword!==confirmPassword){return next(new ErrorHandler("new password and confirm password doesn't match",400))}
     const resetToken=crypto.createHash("sha256").update(token).digest("hex");
     const user=await User.findOne({resetPassword:resetToken,resetPasswordExpire:{$gt:Date.now()}}).select("+password");
     console.log(resetToken)
     if(!user){return next(new ErrorHandler("enter a valid link or link is expired !!",400))}
     
     user.password=req.body.newPassword
     user.resetPassword=undefined;
     user.resetPasswordExpire=undefined;
     user.save({validateBeforeSave:false})
     sendToken(user,200,res);
})
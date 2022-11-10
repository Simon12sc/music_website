import jwt from "jsonwebtoken";
import ErrorHandler from "../errors/error.handler.js";
import handleTryCatch from "../errors/handleTryCatch.js";
import User from "../modules/user.module.js";

export const isAuthenticatedUser=handleTryCatch(async(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){return next(new ErrorHandler("please login to acccess this features",401))};
    const decodedData=jwt.verify(token,process.env.JWT_KEY);
    req.user=await User.findById(decodedData.id);
    next();
})

export const authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){return next(new ErrorHandler(`${req.user.role} are not allowed to access this resources...`))};
        next();
    }
}
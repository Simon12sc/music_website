export default (err,req,res,next)=>{
    const message=err.message || "internal server error..";
    const statusCode=err.statusCode || 500;
    res.status(statusCode).json({success:false,error:message});
}
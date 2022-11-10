import handleTryCatch from "../errors/handleTryCatch.js"
import Music from "../modules/music.module.js"
import fs from "fs";
import ErrorHandler from "../errors/error.handler.js";
import ApiFeatures from "../features/filter.js"

export const createMusic=handleTryCatch(async (req,res,next)=>{
    const musicName=req.file.filename
    const path=req.file.path.split("\\").join("/");
    try{
    
    const music = await Music.create({
        title:req.body.title,description:req.body.description,length:req.body.length,category:req.body.category,music:musicName,path
    })
    res.json({success:true,music})

}catch(error){
    fs.unlink(path,(err)=>{
        if(err){
            console.log(err)
        }
    })
   return next(new ErrorHandler(error,401))
}
})

export const getMusicDetail=handleTryCatch(async(req,res,next)=>{
    const id=req.params.id;
    if(!id){       
        return next(new ErrorHandler("id please...",404));
    }
    const music=await Music.findById(id);
    if(!music){
        return next(new ErrorHandler("Music not found with this id...",404));
    }
    res.status(200).json({success:true,music});
})

export const getAllMusic=handleTryCatch(async (req,res,next)=>{
    const resultPerPage=10;
    const musicCount=await Music.countDocuments();
    const apiFeatures=new ApiFeatures(Music.find(),req.query).search().pagination(resultPerPage);
    const musics=await apiFeatures.query;
    if(musics.length===0){
        return next(new ErrorHandler("music not found",404));
    }
    res.status(200).json({success:true,musics,musicCount});
})

export const deleteMusic=handleTryCatch(async(req,res,next)=>{

    const id=req.params.id;
    if(!id){
        return next(new ErrorHandler("provide me id please",404))
         }
    const music=await Music.findById(id);
    if(!music){
        return next(new ErrorHandler("music not found",404))
       }
    fs.unlink(music.path,(err)=>{
        if(err){console.log(err)}
    })
   await music.remove();
   res.status(200).json({success:true})
})


export const updateMusic=handleTryCatch(async(req,res,next)=>{
    const music=await Music.findByIdAndUpdate(req.params.id,{title:req.body.title,description:req.body.description,category:req.body.category},{new:true,runValidators:true,useFindAndModify:false});
    if(!music){
        return next(new ErrorHandler("music not found..",400));
    }
    res.status(200).json({success:true,music});
})



export const updateMusicFile=handleTryCatch(async(req,res,next)=>{
    const id=req.params.id;
    if(!id){return next(new ErrorHandler("id is required ..."))}
    
    if(!req.file){return next(new ErrorHandler("music file is required to change it..."))}
    
    const music=await Music.findById(id)
    if(!music){return next("music not found...",400)}

    fs.unlink(music.path,(err)=>{if(err){console.log(err)}})
    music.path=req.file.path;
    music.music=req.file.originalname;
    music.save({validateBeforeSave:false});
    res.status(200).json({success:true,message:"music has been changed..."})
})


export const createComment=handleTryCatch(async (req,res,next)=>{
    const isUser=req.user;
    if(!isUser){return next(new ErrorHandler("please login first to access this features...",400))}
    
    const {comment}=req.body;
    if(!comment){return next(new ErrorHandler("comment is required !!",400))}
    const {id}=req.params
    if(!id){return next(new ErrorHandler("id of music is required !!",400))}

    const music=await Music.findById(id);
    if(!music){return next(new ErrorHandler("music not found !!",404))}

    const newComment={
        name:req.user.name,
        comment,
        user:req.user._id
    }
    music.comments.push(newComment);
    await music.save({validateBeforeSave:false});
    res.status(200).json({success:true,comments:music.comments,length:music.comments.length})
    
})

export const deleteComment=handleTryCatch(async (req,res,next)=>{
    const isUser=req.user;
    if(!isUser){return next(new ErrorHandler("please login first to access this features...",400))}
    
    const musicId=req.body.musicId
    if(!musicId){return next(new ErrorHandler("product id is requried...",400))}
    
    const commentId=req.body.commentId
    if(!commentId){return next(new ErrorHandler("comment id is required...",400))}
    
    console.log(musicId)
    const music=await Music.findById(musicId)
    if(!music){return next(new ErrorHandler("music not found...",400))}

    music.comments=music.comments.filter((comment)=>comment._id.toString()!==commentId && comment.user!==req.user._id.toString())
    music.save({validateBeforeSave:false})

    res.status(200).json({success:true,message:"comment deleted..",comments:music.comments});

})

export const updateComment=handleTryCatch(async (req,res,next)=>{
    const isUser=req.user;
    if(!isUser){return next(new ErrorHandler("please login first to access this features...",400))}
    
    const musicId=req.body.musicId
    if(!musicId){return next(new ErrorHandler("product id is requried...",400))}
    
    const commentId=req.body.commentId
    if(!commentId){return next(new ErrorHandler("comment id is required...",400))}
    
    const newComment=req.body.newComment;
    if(!newComment){return next(new ErrorHandler("comment is required...",400))}

    const music=await Music.findById(musicId)
    if(!music){return next(new ErrorHandler("music not found...",400))}

    music.comments=music.comments.filter((comment)=>{
        if(comment._id.toString()===commentId && comment.user.toString()===req.user._id.toString()){
            comment.comment=newComment
            console.log(0)
        }
            return comment;
        })

        

    music.save({validateBeforeSave:false})

    res.status(200).json({success:true,message:"comment deleted..",comments:music.comments});

})

export const getComments=handleTryCatch(async(req,res,next)=>{
    console.log(req.params)
    const musicId=req.params.id;
    if(!musicId){return next(new ErrorHandler("product id is required...",400))}
    
    const music = await Music.findById(musicId)
    res.status(200).json({success:true,comments:music.comments,length:music.comments.length})
})
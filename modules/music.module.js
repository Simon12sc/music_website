import mongoose from "mongoose";
const {Schema,model}=mongoose;


const musicSchema=new Schema({
    title:{
        type:String,
        required:[true,"eplease enter the title of product"],
    },
    description:{
        type:String,
        required:[true,"please enter your description of your music"]
    },
    music:{
        type:String,
        required:[true,"enter your music or story here"]
    },
    category:{
        type:String
    },
    path:{
        type:String,
        required:[true,"enter here a path "]
    },
    length:{
        type:Number,
        required:[true,"length of music is required.."]
    },
    comments:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            name:{
                type:String,
                required:true
            },
            comment:{
                type:String
            },
            createdAt:{
                type:Date,
                default:Date.now()
            }
        }
    ]
},{timestamps:true})
const Music=model("Music",musicSchema);
export default Music;
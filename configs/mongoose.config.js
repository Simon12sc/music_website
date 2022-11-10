import mongoose from "mongoose";

export default function connectDatabase(){
    mongoose.connect(process.env.MONGOOSE_URI,{useNewUrlParser:true,useUnifiedTopology:true}).then((data)=>{
        console.log(`mongodb data base is connected with server : ${data.connection.host}`);
    }).catch(error=>{
        console.log(error)
    })
}
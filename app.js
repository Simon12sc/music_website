import express from "express";
const app=express();

import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

import cookieParser from "cookie-parser";
app.use(cookieParser());

import dotenv from "dotenv";
dotenv.config({path:"./configs/config.env"});


app.use(express.static("./public"));
app.set("view engine","ejs");

//router
import musicRouter from "./routers/music.router.js"
import userRouter from "./routers/user.router.js";
import pageRouter from "./routers/page.router.js";

app.use("/api/v1/music",musicRouter);
app.use("/api/v1/user",userRouter);
app.use("/",pageRouter);


app.get("/public/:folder/:musicname",(req,res,next)=>{
    res.sendFile(`${__dirname}/public/${req.params.folder}/${req.params.musicname}`);
})
//error handler
import errorMiddleware from "./errors/error.middleware.js";
app.use(errorMiddleware);

export default app;
import handleTryCatch from "../errors/handleTryCatch.js";

export const renderHomePage=handleTryCatch(async (req,res,next)=>{
    res.render("index.ejs");
})

export const renderDashboardPage=handleTryCatch(async (req,res,next)=>{
    res.render("dashboard.ejs");
})
import app from "./app.js"
import connectDatabase from "./configs/mongoose.config.js"
const port=process.env.PORT || 8000

const server=app.listen(port,()=>{
    console.log(`${port} port has been started...`)
    connectDatabase();
})

export default server;
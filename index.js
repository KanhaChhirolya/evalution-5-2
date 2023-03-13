const express = require("express")
const app = express()

require("dotenv").config()

const {connection} =require("../backend/configs/db")
const { userRouter } = require("./routes/user.routes")
const {authentication} = require("./middleware/authantication .middleware")
const {productRouter} = require("./routes/product.routes")

app.use(express.json())

app.use("/user",userRouter)
app.use(authentication)
app.use("/product",productRouter)

app.listen(process.env.port,async(req,res)=>{
    try
    {
      await connection
      console.log("Connected to Database")
    } 
    catch(err)
    {
       console.log(err)
    }
       console.log(`server is listing at ${process.env.port}`)
})


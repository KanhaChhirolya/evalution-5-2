const express = require("express")
const app = express()
const userRouter = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const fs = require("fs")


const {userModel} = require("../models/user.model")


require("dotenv").config()



app.use(express.json())

userRouter.get("/",(req,res)=>{
    res.send({msg:"this default route"})
})

// route for signup user

userRouter.post("/signup",async(req,res)=>{
    const {email,password,name} = req.body
    try
    {
       bcrypt.hash(password,6,async(err,hash)=>{
        if(err){
            res.send({msg:"something went wrong",error:err.msg})
        }else{
            const User = new userModel({name,email,password:hash})
            await User.save()
            res.status(200).send({msg:"User signup Succesfully"})
        }
       })
    }
    catch(err)
    {
        res.status(500).send({msg:"something went wrong",error:err.msg})
    }
})

// route for login user

userRouter.post("/login",async(req,res)=>{
    try
    {
       const {email,password} = req.body

       const isUserPresent = await userModel.findOne({email})

       if(!isUserPresent){
       return res.send("User not present register")
       }

    const ispasswordcorrect = await bcrypt.compareSync(password,isUserPresent.password)

    if(!ispasswordcorrect)
    return res.send("Invalid Creadentials")

    const token = await jwt.sign({email,userId:isUserPresent._id},process.env.token_key,{expiresIn:"1m"})

    const refresh_token = await jwt.sign({email,userId:isUserPresent._id},process.env.ref_token_key,{expiresIn:"5m"})

    res.status(200).send({msg:"Login success",token,refresh_token})


    }
    catch(err)
    {
        res.status(500).send({msg:"something went wrong",error:err.msg})
    }
})

// route for getting refresh token for user

userRouter.get("/refreshtoken",async(req,res)=>{
    const refresh_token = req.headers.authorization.split("")[1];
    if(!refresh_token){
        res.send({msg:"Please Login again"})
    }
     jwt.verify(refresh_token,process.env.ref_token_key,async(err,decoded)=>{
        if(!decoded){
            res.send({msg:"Please login again",error:err})
        }
        else{
            const token = await jwt.sign({email:decodedemail,userId:decoded.userId},process.env.token_key,{expiresIn:"5m"});
            res.status(200).send({msg:"Login succesfull and new token genrated",Token:token})
        }
     })
})


// route for logout user

userRouter.get("/logout",async(req,res)=>{
    const token = req.headers.authorization.split("")[1];
    try
    { 
       const blacklist = JSON.parse(fs.readFileSync("../blacklist.json","utf-8"))
       blacklist.push(token)
       fs.writeFileSync("../blacklist.json",JSON.stringify(blacklist))
       res.status(200).send({msg:"Logout Successfull"})
    }
    catch(err)
    {
        res.status(500).send({msg:"something went wrong",error:err.msg})
    }
})


module.exports = {userRouter}
const mongoose = require("mongoose")

const userScema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,required:true,default:"customer",enum:["seller","customer"]}
})

const userModel = mongoose.model("user",userScema)

module.exports = {userModel}
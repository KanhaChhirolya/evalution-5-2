const mongoose = require("mongoose")

const productSchema = mongoose.Schema({
    title:{type:String,required:true},
    price:{type:Number,required:true}
})

const productModel = mongoose.model("product",productSchema)

module.exports = {productModel}
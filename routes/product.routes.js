const express = require("express")
const app = express()
const productRouter = express.Router()
const {userModel} = require("../models/user.model")
const {productModel} = require("../models/product.model")

const {authorise} = require("../middleware/authorization")


productRouter.get("/products",async(req,res)=>{
   try
   {
    const products = await productModel.find()
    res.status(200).send({msg:"all products",products})
   }
   catch(err)
   {
     res.status(500).send({msg:("something went wrong",err)})
   }
})


productRouter.post("/addproducts",authorise(["seller"]),async(req,res)=>{
    try
    {
        const {title,price} = req.body
        const newproduct = new userModel({title,price})
        await newproduct.save() 
        res.status(200).send({msg:"product Added"})
    }
    catch(err)
    {
      res.status(500).send({msg:("something went wrong",err)})
    }
 })

 
 productRouter.delete("/deleteproducts",authorise(["seller"]),async(req,res)=>{
    try
    {
        const productid = req.params.id
        await productModel.findByIdAndDelete(productid)
        res.status(200).send({msg:"product Deleted"})
    }
    catch(err)
    {
      res.status(500).send({msg:("something went wrong",err)})
    }
 })

 module.exports = {productRouter}
 




app.use(express.json())

module.exports = {productRouter}
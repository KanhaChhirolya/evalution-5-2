const jwt = require("jsonwebtoken");
require("dotenv").config()

const fs = require("fs")

const authentication = async(req,res,next) =>{
    const token = req.headers?.authorization?.split(" ")[1]

    try
    {
       if(!token){
        return res.status(401).send({msg:"Please Login"})
       }

       const blacklist = JSON.parse(fs.readFileSync("../blacklist.json","utf-8"))
       for(let i=0;i<blacklist.length;i++){
        if(token==blacklist[i]){
            return res.status(401).send({msg:"you are blacklisted please login again"})
        }
       }

       const istokenValid = await jwt.verify(token,process.env.token_key)
       if(!istokenValid){
        return res.status(403).send({msg:"Authentication Failed, Please Login again"})
       }
       next()
    }
    catch(err)
    {
       return res.status(500).send({msg:"Some thing went wrong"})
    }
}

module.exports = {authentication}
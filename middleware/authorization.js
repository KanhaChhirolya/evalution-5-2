const authorise = (permittedrole) =>{
    return (req,res,next)=>{
        const userrole = req.user.userrole;
        if(permittedrole.includes(userrole)){
            next();
        }else{
            res.send({msg:Unauthorized})
        }
    }
}

module.exports = {authorise}
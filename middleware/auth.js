const Users=require("../models/userModel");
const jwt=require("jsonwebtoken");
require("dotenv").config();


const auth=async(req,res,next)=>{
    try {
        const token=req.header("Authorization");
        // console.log(req.header);
        if(!token)
            return res.status(400).json({msg:"Invalid Authentication"});

            const decoded=jwt.verify(token,process.env.SECRET_KEY);
            // { id: '6108454a3590e9117c98fb9e', iat: 1628141308, exp: 1628227708 } after consoling decoded
           
            if(!decoded){
                return res.status(400).json({msg:"Invalid Authorization"});

            }

            const user=await Users.findOne({_id:decoded.id});
            req.user=user;
            req.token=token;
            // console.log(req.token);
            next();
        
    } catch (error) {
        return res.status(500).json({msg:error.message});
    }
}

module.exports=auth;
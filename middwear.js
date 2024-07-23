import jwt from "jsonwebtoken";
import UserModel from './models/user.js'; 

export const isAuthenticate = async (req,res,next) => {
    try{
        const token = req.cookies.token;
      
        if(!token) {
            res.status(401).json({
                success: false,
                message: 'unauthorized user'
            })
            return
        }
        const decodeToken = jwt.verify(token,process.env.JWT_SECRET);
        const user = await UserModel.findById(decodeToken._id);
        if(!user) {
            res.status(401).json({
                success: false,
                message: 'unauthorized user'
            })
            return
        }

        req.user = user;

        next()

    }catch(err){
        res.status(501).json({
            success: false,
            message: err.message
        })
    }
}
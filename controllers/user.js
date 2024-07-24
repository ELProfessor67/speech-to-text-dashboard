
import UserModel from '../models/user.js'; 
import sendResponse from '../utils/sendResponse.js';
import {sendToken} from '../utils/sendToken.js';


export const register = async (req, res) => {
    try {
        
    
	const {name, email, password} = req.body;
	if(!name || !email || !password){
		return sendResponse(false, 401, 'All fields are required',res);
	}

	const user = await UserModel.create(req.body);

	sendToken(res, user, "Registered Successfully", 201);
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message
          })
    }
};


export const login = async (req, res, next) => {
    try{
	const {email, password} = req.body;
    console.log(email,password)
    
	if(!email || !password) {
        res.status(401).json({
            success: false,
            message: "Please fill all fields"
        })
        return
    }
	let user;
    user = await UserModel.findOne({email});
	
	if (!user){
        res.status(401).json({
            success: false,
            message: "Invalid Details"
        })
        
        return 
    }

	const isMatch = await user.comparePassword(password);
    if (!isMatch){
        res.status(401).json({
            success: false,
            message: "Incorrect Email or Password"
        })
        return
    }
  
    sendToken(res, user, `Welcome back, ${user.name}`, 200);
} catch (error) {
    res.status(501).json({
        success: false,
        message: error.message
      })
}
};

export const loadme = async (req, res, next) => {
    try{
	res.status(200).json({
		success: true,
		user: req.user
	})
} catch (error) {
    res.status(501).json({
        success: false,
        message: error.message
      })
}
};

export const logout = async (req, res, next) => {
	res.clearCookie('token').status(200).json({
		success: true,
		message: 'Logout successfully'
	})
};


export const changePassword = async (req, res, next) => {
    try{
        const {oldpassword, newpassword} = req.body;
        const user = await UserModel.findById(req.user._id);

      
        
        const isMatch = await user.comparePassword(oldpassword);
        if (!isMatch)
            return sendResponse(false, 401, 'Incorrect old password',res);
        console.log(user)
        user.password = newpassword;
        await user.save();
    
        sendResponse(true,200,'Password update successfully',res);
    } catch (error) {
        res.status(501).json({
            success: false,
            message: error.message
        })
    }
};

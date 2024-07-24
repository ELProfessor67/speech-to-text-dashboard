import express from 'express';
import { changePassword, loadme, login, logout, register } from '../controllers/user.js';
import { isAuthenticate } from '../middwear.js';
const userRouter = express.Router();


// users routes
// userRouter.route('/register').post(register);
userRouter.route('/login').post(login);
userRouter.route('/me').get(isAuthenticate,loadme);
userRouter.route('/logout').get(isAuthenticate,logout);
userRouter.route('/change-password').post(isAuthenticate,changePassword);

export default userRouter;

import express from 'express';
import { loadme, login, logout, register } from '../controllers/user.js';
import { isAuthenticate } from '../middwear.js';
const userRouter = express.Router();


// users routes
// userRouter.route('/register').post(register);
userRouter.route('/login').post(login);
userRouter.route('/me').get(isAuthenticate,loadme);
userRouter.route('/logout').get(isAuthenticate,logout);

export default userRouter;

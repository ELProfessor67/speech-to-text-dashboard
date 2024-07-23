import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const schema = new mongoose.Schema({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true},
	
	password: {type: String, required: true, selected: false},
},{timestamps: true});

schema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
  });
  
  schema.methods.getJWTToken = function () {
	
	return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
	  expiresIn: "15d",
	});
  };
  
  schema.methods.comparePassword = async function (password) {
	return await bcrypt.compare(password, this.password);
  };
  


export default mongoose.model('user', schema);
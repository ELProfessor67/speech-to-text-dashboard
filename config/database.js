import mongoose from "mongoose";
import { Directory } from "../models/folders.js";

const createRootDirectory = async () => {
    const isExist = await Directory.findOne({name: 'root'});
    if(!isExist){
        const rootDir = new Directory({
            name: 'root',
            type: 'directory',
            contents: []
          });
        
          await rootDir.save();
          console.log('Root directory created');
    }
  };

export async function connectDB(){
    try {
        const {connection} = await mongoose.connect(process.env.DB_URL);
        console.log( `DB connect to ${connection?.host}`)
        createRootDirectory()
    } catch (error) {
        console.log(`error while connecting databse: ${error.message}`);
        process.exit(1);
    }
}
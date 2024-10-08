
import path from 'path'
import { addFile } from '../utils/addDirectoryFunctions.js';
import { getFilePerticularWithDate, getFilePerticularWithWord, listFilesAndDirectories, listFilesAndDirectoriesAndroid } from '../utils/getAllDirectory.js';
const __dirname = path.resolve()
import fs from 'fs'



export const uploadFolder = async (req, res) => {
  try {
    const rootDirectoryName = process.env.FOLDER_DIR_PATH
    const files = req.files || [];
    const body = req.body;
    const currentpath = req.body.currentpath

    for (let i = 0; i < files.length; i++) {
      const element = files[i];
      if(currentpath){
        element.path = path.join(currentpath,body[`path-${i}`])
      }else{
        element.path = path.join(rootDirectoryName,body[`path-${i}`])
      }
      element.playform = body[`platform-${i}`] || 'default';
      element.storepath = body[`storepath-${i}`] || undefined;
      element.birthdate = body[`date-${i}`]
      element.creationDate = body[`creationdate-${i}`] || new Date().getTime()
      element.time = body[`time-${i}`] || '170121';
      await addFile(element)
    }

    res.send('add successfully')
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message
    })
  }
}


export const getFolder = async (req, res) => {
  try {
    const rootDirectoryName = process.env.FOLDER_DIR_PATH
    // const result = listFilesAndDirectories(path.join(__dirname,rootDirectoryName));
    const android_directory = listFilesAndDirectoriesAndroid(path.join('/root/file-manager-api/eligindi/Calls'));
    // res.status(200).json({
    //   success: true,
    //   folder: [...result,{
    //     children: android_directory,
    //     isFolder: true,
    //     path: '/root/file-manager-api/eligindi/Calls',
    //     name: 'Android',
    //   }]
    // })
    res.status(200).json({
      success: true,
      folder: android_directory
    })
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message
    })
  }
}

export const getFile = async (req, res) => {
  try {
    const file_path = req.query.path;
    const file = fs.readFileSync(file_path,'utf-8');
    res.status(200).json({
      success: true,
      content: file
    })
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message
    })
  }
}


export const getFileWithWord = async (req, res) => {
  try {
    const query = req.query.query;
    const rootDirectoryName = process.env.FOLDER_DIR_PATH
    const files = await getFilePerticularWithWord(query,path.join(__dirname,rootDirectoryName))
    res.status(200).json({
      success: true,
      files
    })
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message
    })
  }
}
export const getFileWithDate = async (req, res) => {
  try {
    const date = req.query.date;
    const enddate = req.query.enddate
    const rootDirectoryName = process.env.FOLDER_DIR_PATH
    const files = await getFilePerticularWithDate(date,enddate,path.join(__dirname,rootDirectoryName))
    res.status(200).json({
      success: true,
      files
    })
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message
    })
  }
}
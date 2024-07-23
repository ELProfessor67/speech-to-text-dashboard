import express from 'express';
import multer from 'multer';
import { getFile, getFileWithDate, getFileWithWord, getFolder, uploadFolder } from '../controllers/upload.js';
import { isAuthenticate } from '../middwear.js';

const storage = multer.memoryStorage();
const upload = multer({ storage }).array('files');
const uploaderRouter = express.Router();

uploaderRouter.post('/upload',isAuthenticate, upload, uploadFolder);
uploaderRouter.get('/get-folders', isAuthenticate,getFolder);
uploaderRouter.get('/get-file',isAuthenticate, getFile);
uploaderRouter.get('/get-file-with-word',isAuthenticate,getFileWithWord);
uploaderRouter.get('/get-file-with-date',isAuthenticate,getFileWithDate);

export default uploaderRouter;

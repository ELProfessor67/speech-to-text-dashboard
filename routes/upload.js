import express from 'express';
import multer from 'multer';
import { getFile, getFileWithDate, getFileWithWord, getFolder, uploadFolder } from '../controllers/upload.js';

const storage = multer.memoryStorage();
const upload = multer({ storage }).array('files');
const uploaderRouter = express.Router();

uploaderRouter.post('/upload', upload, uploadFolder);
uploaderRouter.get('/get-folders', getFolder);
uploaderRouter.get('/get-file', getFile);
uploaderRouter.get('/get-file-with-word', getFileWithWord);
uploaderRouter.get('/get-file-with-date', getFileWithDate);

export default uploaderRouter;

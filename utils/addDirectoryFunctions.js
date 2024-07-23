import fs from 'fs';
import getDataUri from './dataURI.js';
import { exec } from 'child_process';

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  }

  
export const addFile = async (file) => {
    const path = file.path;
    const date = file.birthdate;
    


    const mode = process.env.MODE;
    let folders;
    if(mode == 'dev'){
        folders = path.split('\\');
    }else{
        folders = path.split('/');
    }

    const filename = folders.pop();

    for (let i = 0; i < folders.length; i++) {
        const element = folders[i];
        if(element == '.' || element == '') continue;
        
        const tempPath = folders.slice(0,i+1).join('/');
        if(!fs.existsSync(tempPath)){
            fs.mkdirSync(tempPath);
        }
        
    }
    const fileParserRef = getDataUri(file);
    const creationDate = new Date(+date);
 
     
    
    const file_path = folders.join('/') + `/${formatDate(creationDate)}@date` +  filename
    console.log(file_path)
    fs.writeFileSync(file_path,fileParserRef.buffer);



    const execPromise = (command) => {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(`exec error: ${error}`);
                } else if (stderr) {
                    reject(`stderr: ${stderr}`);
                } else {
                    resolve(stdout);
                }
            });
        });
    };


    const pythonpath = mode == 'dev' ? 'python' : 'python3';
    try {
        const result = await execPromise(`${pythonpath} main.py --path ${file_path} --date ${date}`);
        console.log(`stdout: ${result}`);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }

} 
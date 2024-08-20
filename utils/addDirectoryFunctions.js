import fs from 'fs';
import getDataUri from './dataURI.js';
import { exec } from 'child_process';



function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
  
    
    return `${day}-${month}-${year}`;
  }

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


  const convertAudio = async (inputPath, outputPath) => {
    try {
        // Wrap file paths in quotes to handle spaces and special characters
        const quotedInput = `"${inputPath}"`;
        const quotedOutput = `"${outputPath}"`;

        // Construct the ffmpeg command
        const command = `ffmpeg -i ${quotedInput} -ar 22050 -ac 1 -b:a 128k -y ${quotedOutput}`;

        // Log the command for debugging
        console.log(`Executing command: ${command}`);

        // Execute the command and get the result
        const result = await execPromise(command);
        console.log('ffmpeg output:', result);

        return true;  // Indicate success
    } catch (error) {
        console.error('Error during conversion:', error);
        return false; // Indicate failure
    }
};

  
export const addFile = async (file) => {
    const path = file.path;
    const date = file.birthdate;
    const platform = file.playform;
    const storepath = file.storepath;


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
 
     
    
    let file_path = folders.join('/') + `/${platform}@date${formatDate(creationDate)}@date` +  filename
    console.log(file_path)
    fs.writeFileSync(file_path,fileParserRef.buffer);

    if(filename?.includes('amr')){
        try {
            
            const input  = file_path;
        
            const output =  file_path.replace('amr','mp3');
        
            const result = await convertAudio(input,output);
            file_path = output
            fs.unlinkSync(input);
        } catch (error) {
            console.error(err);
            return false;
        }
      
    }

  
    


    const pythonpath = mode == 'dev' ? 'python' : 'python3';
    try {
        let result;
        if(storepath){
             result = await execPromise(`${pythonpath} main.py --path ${file_path} --date ${date} --storepath ${storepath}`);
        }else{
             result = await execPromise(`${pythonpath} main.py --path ${file_path} --date ${date}`);

        }
        console.log(`stdout: ${result}`);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }

} 
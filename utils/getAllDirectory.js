
import fs from 'fs';
import path from 'path';



function searchFileInPaths(fileName, searchPath) {
  let foundFile = null;

  // Helper function to search files recursively
  function searchDirectory(directory) {
      const files = fs.readdirSync(directory);

      for (const file of files) {
          const fullPath = path.join(directory, file);

          if (fs.statSync(fullPath).isDirectory()) {
              // Recursively search in directories
              if (searchDirectory(fullPath)) {
                  return true;
              }
          } else if (file.includes(fileName)) {
              // If the file name contains the search string, save its path and stop searching
              foundFile = fullPath;
              return true;
          }

          if (foundFile) return true;
      }

      return false;
  }

  if (fs.existsSync(searchPath)) {
      searchDirectory(searchPath);
  }

  return foundFile; // Returns the file path or null if not found
}

function getPublicURL(filePath) {
  // Normalize the path to ensure consistency
  const normalizedPath = path.normalize(filePath);

  // Split the path into parts
  const parts = normalizedPath.split(path.sep);

  // Find the index of the specified directory ('eligindi')
  const index = parts.indexOf('eligindi');

  if (index === -1) {
      console.log("The specified directory 'eligindi' was not found in the path.");
      return filePath;
  }

  // Extract the part of the path after 'eligindi'
  const pathAfterEligindi = parts.slice(index+1).join(path.sep);

  // Return the new path that starts from 'eligindi'
  return `/public/${pathAfterEligindi}`;
}

const parseDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  return new Date(year, month - 1, day).getTime();
};

export const listFilesAndDirectories = (dirPath,results=[]) => {
  

  const items = fs.readdirSync(dirPath);
  items.forEach((item) => {
    const fullPath = path.join(dirPath, item);
    
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const subfolder = []
      listFilesAndDirectories(fullPath,subfolder); // Recursively list subdirectories and files
      results.push({ isFolder: true,path:fullPath,name: item,children: subfolder});
    } else if (stat.isFile()) {
      const name = item.split('@date')[4];
      const creationDate = item.split('@date')[1];
      const platform = item.split('@date')[0];
      const time = item.split('@date')[2]
      const fileCreationDate = item.split('@date')[3]
      
     
    
      results.push({isFolder: false,path:fullPath,name,creationDate,platform,time,fileCreationDate});
    }
  });

  return results;
};
export const listFilesAndDirectoriesAndroid = (dirPath,results=[]) => {
  

  const items = fs.readdirSync(dirPath);
  items.forEach((item) => {
    const fullPath = path.join(dirPath, item);
    
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const subfolder = []
      listFilesAndDirectoriesAndroid(fullPath,subfolder); // Recursively list subdirectories and files
      results.push({ isFolder: true,path:fullPath,name: item,children: subfolder});
    } else if (stat.isFile()) {
      const name = item.split('@date')[5];
      const creationDate = item.split('@date')[2];
      const platform = item.split('@date')[1];
      const path = Buffer.from(item.split('@date')[0], 'base64').toString('utf-8')?.replace('mp3','txt');
      const time =  item.split('@date')[3]
      const fileCreationDate = item.split('@date')[4]
      results.push({isFolder: false,path,name,creationDate,platform,audioPath: getPublicURL(fullPath),time,fileCreationDate});
    }
  });

  return results;
};


export const getFileWithWord = async (word,dirPath,results) => {
  const items = fs.readdirSync(dirPath);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const fullPath = path.join(dirPath, item);
    
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await getFileWithWord(word,fullPath,results);
     
    } else if (stat.isFile()) {
      const fileContent = fs.readFileSync(fullPath,'utf-8');
      if(fileContent?.toLocaleLowerCase().includes(word.toLocaleLowerCase())){
        const index = fileContent.toLocaleLowerCase().indexOf(word.toLocaleLowerCase());
        const start = index-80 >= 0 ? (index-80) : 0;
        let content = fileContent.slice(start,index+80)
        content = content.toLocaleLowerCase().replaceAll(word.toLocaleLowerCase(),`<span style="background: red;">${word}</span>`);
        const platform = item.split('@date')[0];
        let audioPath = searchFileInPaths(item.replace('txt',''),'/root/file-manager-api/eligindi/Calls');
        const fileCreationDate = item.split('@date')[3]
        if(audioPath){
          audioPath = getPublicURL(audioPath)
        }
        results.push({path:fullPath,name:item.split('@date')[4],content,creationDate:item.split('@date')[1],platform,audioPath,time:item.split('@date')[2],platform: item.split('@date')[0],fileCreationDate });
      }
    }
  }
 

  return results;
};






export const getFilePerticularWithWord = async (word,path) => {
  const results = [];
  await getFileWithWord(word,path,results)
  return results;

}




export const getFileWithDate = async (date,enddate,dirPath,results) => {
  const items = fs.readdirSync(dirPath);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const fullPath = path.join(dirPath, item);
    
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await getFileWithDate(date,enddate,fullPath,results);
     
    } else if (stat.isFile()) {
     
      const fileDate = item.split('@date')[1];
      if(!fileDate) return
      const [fdays,fmonth,fyear] = fileDate?.split('-');
      const startDateObj = parseDate(date);
      const endDateObj = parseDate(enddate);
      const fileDateObj = parseDate(`${fyear}-${fmonth}-${fdays}`);
      let audioPath = searchFileInPaths(item.replace('txt',''),'/root/file-manager-api/eligindi/Calls');
      const fileCreationDate = item.split('@date')[3]
      if(audioPath){
        audioPath = getPublicURL(audioPath)
      }

      
      if (fileDateObj >= startDateObj && fileDateObj <= endDateObj) {
        const platform = item.split('@date')[0];
        results.push({path:fullPath,name:item.split('@date')[4],creationDate:item.split('@date')[1],platform,audioPath,time: item.split('@date')[2],platform:item.split('@date')[0],fileCreationDate });
      }
    }
  }

  return results;
};



export const getFilePerticularWithDate = async (date,enddate,path) => {
  const results = [];
  console.log('call',enddate,path)
  await getFileWithDate(date,enddate,path,results)
  return results;

}
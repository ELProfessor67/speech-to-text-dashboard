import fs from 'fs';
import path from 'path';

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
      const name = item.split('@date')[1]
      const creationDate = item.split('@date')[0]
    
      results.push({isFolder: false,path:fullPath,name,creationDate});
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
        results.push({path:fullPath,name:item.split('@date')[1],content,creationDate:item.split('@date')[0]});
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
      const fileDate = item.split('@date')[0];
      const [fdays,fmonth,fyear] = fileDate?.split('-');
      const startDateObj = parseDate(date);
      const endDateObj = parseDate(enddate);
      const fileDateObj = parseDate(`${fyear}-${fmonth}-${fdays}`);
      
      
      if (fileDateObj >= startDateObj && fileDateObj <= endDateObj) {
        results.push({path:fullPath,name:item.split('@date')[1],creationDate:item.split('@date')[0]});
      }
    }
  }
 

  return results;
};



export const getFilePerticularWithDate = async (date,enddate,path) => {
  const results = [];
  console.log(date)
  await getFileWithDate(date,enddate,path,results)
  return results;

}
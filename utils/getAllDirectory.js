import fs from 'fs';
import path from 'path';


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
    
      results.push({isFolder: false,path:fullPath,name});
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
        results.push({path:fullPath,name:item.split('@date')[1],content});
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




export const getFileWithDate = async (date,dirPath,results) => {
  const items = fs.readdirSync(dirPath);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const fullPath = path.join(dirPath, item);
    
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      await getFileWithDate(date,fullPath,results);
     
    } else if (stat.isFile()) {
      const fileDate = item.split('@date')[0];
      const [fdays,fmonth,fyear] = fileDate?.split('-');
      const [uyear,umonth,udays] = date.split('-');
      if(Number(fdays) === Number(udays) && Number(umonth) === Number(fmonth) && Number(uyear) == Number(fyear)){
        results.push({path:fullPath,name:item.split('@date')[1]});
      }
    }
  }
 

  return results;
};



export const getFilePerticularWithDate = async (date,path) => {
  const results = [];
  console.log(date)
  await getFileWithDate(date,path,results)
  return results;

}
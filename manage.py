import os
import subprocess
from datetime import datetime
import requests
contact_dict = {}

def get_json_data(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return None

def get_timestamp(date_str):
    # Parse the date string into a datetime object
    date_obj = datetime.strptime(date_str, '%d-%m-%Y')
    
    # Convert to a timestamp (milliseconds since epoch)
    timestamp = int(date_obj.timestamp() * 1000)
    
    return timestamp
def format_date(date_str):
    year = date_str[:4]
    month = date_str[4:6]
    day = date_str[6:8]
    
    return f"{day}-{month}-{year}"


def transcrive(file_path,date,storepath):
    command = [
        'python', 'main.py',
        '--path', file_path,
        '--date', str(get_timestamp(date)),
        '--storepath', storepath
    ]
    
    try:
        subprocess.run(command, check=True)
        print("Script executed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error executing script: {e}")


def convert_amr_to_mp3(filepath):
    outputFile = filepath.replace('amr','mp3')

    inputFile = filepath

    command = [
        'ffmpeg',
        '-i', inputFile,
        '-ar', '22050',
        '-ac', '1',
        '-b:a', '128k',
        '-y', outputFile
    ]
    
    try:
        subprocess.run(command, check=True)
        print(f"Successfully processed {outputFile}")
        os.remove(filepath)
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error processing file: {e}")
        return False


def get_all_amr_files(root_folder):
    amr_files = []
    for dirpath, dirnames, filenames in os.walk(root_folder):
        for filename in filenames:
            if filename.endswith('.amr'):
                amr_files.append({"path": dirpath, "name": filename})
    return amr_files

def save_and_transcrive_file(path,filename1):
    file = filename1.split('.')[0]
    platform = file.split('_')[0]
    number = ''
    name = ''
    if not (platform == 'phone' or platform == 'whatsapp' or platform == 'skype'):
        return

    dateinfo = file.split('_')[1]
    date = dateinfo.split('-')[0]
    time = dateinfo.split('-')[1]
    
    if(platform == 'phone'):
        if len(file.split("_")) < 4:
            number = file.split('_')[2]
            
        else:
            number = file.split('_')[3]

                    
            number = number.split('.')[0]
            

        if(len(number) > 10):
            number = number[-10:]
        name = contact_dict.get(number, f"({number})_Not_Saved")
        
            
                    
                    
    elif(platform == 'whatsapp' or platform == 'skype'):
        name = file.split('_')[2]
        name = name.split('.')[0]
        name = name.replace(" ","_")
                
        name = name.replace(" ","_")
    
    
    if(name):
        filenametemp = name.replace(' ','_')
    else:
        filenametemp = number
    # Get the creation time
    creation_time = os.path.getctime(os.path.join(path,filename1))

    # Convert the creation time to a readable format
    creation_date = datetime.fromtimestamp(creation_time).strftime('%d-%m-%Y')
        
    
    date2 = format_date(date)
    filename = f"{path}" + f"/{platform}@date{date2}@date{time}@date{creation_date}@date" +  f"{filenametemp}.mp3"
    os.rename(os.path.join(path,filename1),filename)
    transcrive(filename,date2,f"/root/file-manager-api/eligindi/Calls/{filenametemp}")


    

# Example usage
root_folder = './root'
amr_files = get_all_amr_files(root_folder)
url = 'https://cloud.hgsingalong.com/api/read-contact'
data = get_json_data(url)
if data and data.get('success'):
    contacts = data.get('contact', [])
    
    for contact in contacts:
        number = contact.get('number')
        if number == None:
            continue

        if(len(number) > 10):
            number = number[-10:]
        
        name = contact.get('name', number)
        if number:  
            contact_dict[number] = name


for i in amr_files:
    path = i.get('path')
    name = i.get('name')
    result = convert_amr_to_mp3(os.path.join(path,name))
    if(result):
       name = name.replace('amr','mp3')
    else:
        continue
    save_and_transcrive_file(path,name)

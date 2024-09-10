import speech_recognition as sr
import argparse
from pydub import AudioSegment
import os
import shutil
import base64
import time
import whisper

model = whisper.load_model("small")

def create_path_if_not_exists(path):
    if not os.path.exists(path):
        os.makedirs(path)
        print(f"Path '{path}' created.")
    else:
        print(f"Path '{path}' already exists.")

def move_file(file_path, destination_folder):
    try:
        # Ensure the destination folder exists
        if not os.path.exists(destination_folder):
            os.makedirs(destination_folder)

        # Move the file to the destination folder
        shutil.move(file_path, destination_folder)
        print(f"Moved: {file_path} -> {destination_folder}")

    except Exception as e:
        print(f"Error moving file: {e}")

def convert_audio_to_text(file_path, date,storepath):
    recognizer = sr.Recognizer()
    temp_wav = "temp.wav"

    try:
        # Convert the audio file to WAV format
        audio = AudioSegment.from_file(file_path)
        audio.export(temp_wav, format="wav")
        
        # Load the temporary WAV file
        # with sr.AudioFile(temp_wav) as source:
        #     audio_data = recognizer.record(source)
        #     try:
        #         text = recognizer.recognize_google(audio_data)
        #     except sr.UnknownValueError:
        #         text = "Google Speech Recognition could not understand the audio."
        #     except sr.RequestError as e:
        #         text = f"Could not request results from Google Speech Recognition service; {e}"
        result = model.transcribe(temp_wav,language='en')
        text = result['text']
        
        # Generate the .txt file path
        base_name = os.path.splitext(file_path)[0]
        txt_file_path = f"{base_name}.txt"
        
        # Write the text to the .txt file
        with open(txt_file_path, 'w') as file:
            file.write(text)
            timestamp = date / 1000
            os.utime(txt_file_path, (timestamp, timestamp))
        
        print(f"Text file created at: {txt_file_path}")
        
        # Move the original audio file
        destination_folder = storepath if storepath else "/root/file-manager-api/eligindi/Calls"
        directory = os.path.dirname(file_path)
        filename = os.path.basename(file_path)
        str_bytes = file_path.encode('utf-8')
        base64_bytes = base64.b64encode(str_bytes)

        base64_bytes = str(base64_bytes)
        base64_bytes = base64_bytes.replace("b'",'').replace("'",'')
        
        filename = f"{base64_bytes}@date{filename}"
        
        os.rename(file_path,f"{directory}/{filename}")
        create_path_if_not_exists(destination_folder)
        move_file(f"{directory}/{filename}", destination_folder)
        
    finally:
        # Clean up the temporary wav file
        if os.path.exists(temp_wav):
            os.remove(temp_wav)

def main():
    # Create the parser
    parser = argparse.ArgumentParser(description="Script to convert audio files to text and move them.")
    
    # Add the --path argument
    parser.add_argument("--path", type=str, required=True, help="Path to the audio file.")
    parser.add_argument("--date", type=int, required=True, help="Creation date of the file (timestamp in milliseconds).")
    parser.add_argument("--storepath", type=str, required=False, help="audio file move path")
    
    # Parse the arguments
    args = parser.parse_args()
    path = args.path
    date = args.date
    storepath = args.storepath if args.storepath else None

    if os.path.isfile(path):
        convert_audio_to_text(path, date,storepath)
    else:
        print(f"The provided path does not point to a valid file: {path}")

if __name__ == "__main__":
    main()

import speech_recognition as sr
import argparse
from pydub import AudioSegment
import os

def convert_audio_to_text(file_path,date):
    recognizer = sr.Recognizer()
    audio = AudioSegment.from_file(file_path)
    audio.export("temp.wav", format="wav")
    
    with sr.AudioFile("temp.wav") as source:
        audio_data = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio_data)
        except sr.UnknownValueError:
            text = "Google Speech Recognition could not understand the audio."
        except sr.RequestError as e:
            text = f"Could not request results from Google Speech Recognition service; {e}"

        
         # Generate the .txt file path
        base_name = os.path.splitext(file_path)[0]
        txt_file_path = f"{base_name}.txt"
        
        # Write the text to the .txt file
        with open(txt_file_path, 'w') as file:
            file.write(text)
            timestamp = date / 1000
            os.utime(txt_file_path, (timestamp, timestamp))
        
        # Clean up the temporary wav file
        os.remove(file_path)


def main():
    # Create the parser
    parser = argparse.ArgumentParser(description="Script to demonstrate --path argument.")
    
    # Add the --path argument
    parser.add_argument("--path", type=str, required=True, help="Path to the file or directory.")
    parser.add_argument("--date", type=int, required=True, help="Creation date of the file")
    
    # Parse the arguments
    args = parser.parse_args()
    path = args.path
    date = args.date
    convert_audio_to_text(path,date)
    
    # Print the path
    print(f"Path provided: {args.path}")

if __name__ == "__main__":
    main()
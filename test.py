import whisper
import json

# Load the Whisper model
model = whisper.load_model("base")

# Transcribe the audio file with word timestamps
result = model.transcribe("./output.wav", word_timestamps=True)

data = []
# Check if words exist in the result and print them
if 'segments' in result:
    for segment in result['segments']:
        if 'words' in segment:  # Check if 'words' exist in the segment
            for word in segment['words']:
                word_detail = [f"{word['word']}",f"{word['start']:.2f}"]
                data.append(word_detail)
                print(f"{word['word']}: {word['start']:.2f}s")
        else:
            print("Word timestamps are not available in this segment.")
else:
    print("No segments found in the transcription result.")

with open('./output.txt','w') as file:
    data_str = json.dumps(data)
    file.write(data_str)
    file.close()
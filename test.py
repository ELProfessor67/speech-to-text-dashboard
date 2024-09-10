import whisper

# Load the Whisper model
model = whisper.load_model("small")  # Use "small", "medium", or "large" for more accuracy but requires more resources

# Transcribe the audio file
result = model.transcribe("./output.wav",language='en')  # Replace with your file path

# Print the transcription
print(result['text'])

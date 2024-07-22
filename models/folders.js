import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['file'], required: true },
  content: { type: String }
});

const directorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['directory'], required: true },
  contents: [mongoose.Schema.Types.Mixed],
  isFolder: {type: Boolean, default: true}
});

export const Directory = mongoose.model('Directory', directorySchema);
export const File = mongoose.model('File', fileSchema);

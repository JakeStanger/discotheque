import { Schema } from 'mongoose';

interface IAttachment {
  id: string;
  fileName?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  url?: string;
}

export const attachmentSchema = new Schema({
  id: String,
  fileName: String,
  fileSize: Number,
  width: { type: Number, required: false },
  height: { type: Number, required: false },
  url: String
});

export default IAttachment;

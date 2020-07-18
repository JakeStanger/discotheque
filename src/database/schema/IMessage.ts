import IAttachment, { attachmentSchema } from './IAttachment';
import { Document, model, Schema } from 'mongoose';

interface IMessage {
  id: string;
  content?: string;
  authorId?: string;
  channelId?: string;
  guildId?: string;
  timestamp?: number;
  attachments?: IAttachment[];
}

const messageSchema = new Schema<IMessage>({
  id: String,
  content: String,
  authorId: { type: String, index: true },
  channelId: { type: String, index: true },
  guildId: { type: String, index: true },
  timestamp: Date,
  attachments: { type: [attachmentSchema] }
});

export const Message = model<IMessage & Document>('Message', messageSchema);
export default IMessage;

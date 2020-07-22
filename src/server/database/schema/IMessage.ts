import IAttachment, { attachmentSchema } from './IAttachment';
import { Document, model, Schema } from 'mongoose';
import { Snowflake } from 'discord.js';
const { Mixed } = Schema.Types;

interface IMessage {
  id: Snowflake;
  content?: string;
  authorId?: Snowflake;
  channelId?: Snowflake;
  guildId?: Snowflake;
  timestamp?: number;
  attachments?: IAttachment[];
  metadata: Map<string, any>;
}

const messageSchema = new Schema<IMessage>({
  id: String,
  content: String,
  authorId: { type: String, index: true },
  channelId: { type: String, index: true },
  guildId: { type: String, index: true },
  timestamp: Date,
  attachments: { type: [attachmentSchema] },
  metadata: { type: Map, of: Mixed }
});

export const Message = model<IMessage & Document>('Message', messageSchema);
export default IMessage;

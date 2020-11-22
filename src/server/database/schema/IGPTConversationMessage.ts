import mongoose, { Document } from 'mongoose';

interface IGPTConversationMessage {
  authorId: string;
  channelId: string;
  content: string;
}

export const gptConversationMessage = new mongoose.Schema<
  IGPTConversationMessage
>({
  authorId: String,
  content: String
});

const GPTConversationMessage = mongoose.model<
  IGPTConversationMessage & Document
>('GPTConversationMessage', gptConversationMessage);

export default IGPTConversationMessage;

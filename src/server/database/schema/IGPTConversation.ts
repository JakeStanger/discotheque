import mongoose, { Document } from 'mongoose';
import IGPTConversationMessage, {
  gptConversationMessage,
} from './IGPTConversationMessage';

interface IGPTConversation {
  channelId: string;
  messages: IGPTConversationMessage[];
  used?: boolean;
}

const gptConversation = new mongoose.Schema<IGPTConversation>({
  channelId: String,
  messages: [gptConversationMessage],
  used: Boolean
});

export const GPTConversation = mongoose.model<IGPTConversation & Document>(
  'GPTConversation',
  gptConversation
);

export default IGPTConversation;

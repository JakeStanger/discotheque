import IAttachment from './IAttachment';

interface IMessage {
  id: string;
  content?: string;
  authorId?: string;
  channelId?: string;
  guildId?: string;
  timestamp?: number;
  attachments?: IAttachment[];
}

export default IMessage;

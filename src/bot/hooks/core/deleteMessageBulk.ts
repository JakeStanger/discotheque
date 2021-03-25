import { Message } from 'discord.js';
import MessageManager from '../../../manager/MessageManager';
import { IHookMetadata } from '../../../helper/hooks/IHook';

async function deleteMessageBulk(messages: Message[]) {
  await Promise.all(
    messages.map((message) => MessageManager.get().delete(message.id))
  );
}

export default deleteMessageBulk;

export const meta: IHookMetadata = {
  event: 'messageDeleteBulk',
  help: 'Bulk deletes messages from the database',
};

import { Message } from 'discord.js';
import MessageManager from '../../../manager/MessageManager';
import { IHookMetadata } from '../../../helper/hooks/IHook';

async function deleteMessage(message: Message) {
  await MessageManager.get().delete(message.id);
}

export default deleteMessage;

export const meta: IHookMetadata = {
  event: 'messageDelete',
  help: 'Deletes a message from the database',
};

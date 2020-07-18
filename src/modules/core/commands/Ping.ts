import Command from '../../../utils/Command';
import Module from '../../../utils/Module';
import { Message } from 'discord.js';
import ICommandDefinition from '../../../utils/ICommandDefinition';

class Ping extends Command {
  constructor(module: Module) {
    super(module);
  }

  protected getDefinition(): ICommandDefinition {
    return {
      name: 'ping',
      description: 'Pong!'
    };
  }

  public async run(message: Message, ...args: string[]): Promise<void> {
    await message.reply('pong');
  }
}

export default Ping;

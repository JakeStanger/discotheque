import Command from '../../../utils/Command';
import { Message } from 'discord.js';
import Music from '../Music';
import ICommandDefinition from '../../../utils/ICommandDefinition';

class Join extends Command {
  constructor(module: Music) {
    super(module);
  }

  protected getDefinition(): ICommandDefinition {
    return {
      name: 'join',
      description: 'Joins your current voice channel.'
    };
  }

  public async run(message: Message, ...args: string[]): Promise<void> {
    await (this.module as Music).joinChannel(message);
  }
}

export default Join;

import Command from '../../../utils/Command';
import Module from '../../../utils/Module';
import { Message } from 'discord.js';

class Ping extends Command {
  constructor(module: Module) {
    super(module);
  }

  public getDescription(): string {
    return 'Pong!';
  }

  public getName(): string {
    return 'ping';
  }

  public async run(message: Message, ...args: string[]): Promise<void> {
    await message.reply('pong');
  }
}

export default Ping;

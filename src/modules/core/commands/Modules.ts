import Command from '../../../utils/Command';
import { Message } from 'discord.js';
import Module from '../../../utils/Module';
import ModuleRegistry from '../../../registries/ModuleRegistry';

class Modules extends Command {
  constructor(module: Module) {
    super(module);
  }

  public getDescription(): string {
    return 'Shows a list of enabled modules.';
  }

  public getName(): string {
    return 'modules';
  }

  public async run(message: Message, ...args: string[]): Promise<void> {
    const modules = ModuleRegistry.get().getModules();

    await message.channel.send({
      embed: {
        title: 'Modules',
        fields: modules.map(module => ({
          name: module.getName(),
          value: module.getDescription() || '-'
        }))
      }
    });
  }
}

export default Modules;

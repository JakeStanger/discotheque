import Command from '../../../utils/Command';
import { Message } from 'discord.js';
import Module from '../../../utils/Module';
import ModuleRegistry from '../../../registries/ModuleRegistry';
import DiscordUtils from '../../../discord/DiscordUtils';
import GuildManager from '../../../database/GuildManager';

class Modules extends Command {
  public readonly admin = false;
  public readonly nsfw = false;

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
    const moduleRegistry = ModuleRegistry.get();
    const modules = moduleRegistry.getModules();

    if (!message.guild) {
      await DiscordUtils.sendError(
        message.channel,
        'This only works inside guilds'
      );
      return;
    }

    const guild = await GuildManager.get().getGuild(message.guild!.id);
    if (!guild) {
      await DiscordUtils.sendError(
        message.channel,
        'Could not find config for guild'
      );
      return;
    }

    await message.channel.send({
      embed: {
        title: 'Modules',
        fields: modules.map(module => {
          const disabled = module.isDisabled(guild);
          return {
            name: module.getName() + (disabled ? ' [DISABLED]' : ''),
            value:
              (disabled ? '~~' : '') +
                module.getDescription() +
                (disabled ? '~~' : '') || '-'
          };
        })
      }
    });
  }
}

export default Modules;

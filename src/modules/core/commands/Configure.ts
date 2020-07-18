import Command from '../../../utils/Command';
import { Message } from 'discord.js';
import Module from '../../../utils/Module';
import GuildManager from '../../../database/GuildManager';
import DiscordUtils from '../../../discord/DiscordUtils';
import IGuild, { Guild } from '../../../database/schema/IGuild';
import ModuleRegistry from '../../../registries/ModuleRegistry';
import { Document } from 'mongoose';

class Configure extends Command {
  public readonly admin = true;
  public readonly nsfw = false;

  constructor(module: Module) {
    super(module);
  }

  public getDescription(): string {
    return 'Configure bot settings.';
  }

  public getName(): string {
    return 'configure';
  }

  public async run(message: Message, ...args: string[]): Promise<void> {
    const [mode, path, value] = args;

    if (!message.guild) {
      await DiscordUtils.sendError(
        message.channel,
        'This can only be used from inside a guild'
      );
      return;
    }

    const guildManager = GuildManager.get();
    const guild = await guildManager.getGuild(message.guild.id);

    if (!guild) {
      await DiscordUtils.sendError(
        message.channel,
        'An error occurred fetching guild settings'
      );
      return;
    }

    switch (mode) {
      case 'get':
        if (!path) {
          await this.sendKeysList(message, guild);
          return;
        }

        const property = guild.get(path, value);
        if (typeof property === 'object') {
          // await this.sendKeysList(message, guild, path);
          await DiscordUtils.sendError(
            message.channel,
            'Nested key listing is not yet implemented'
          );
          return;
        }

        await DiscordUtils.sendEmbed(message.channel, {
          title: path,
          description: property
        });
        break;
      case 'set':
        if (!path) {
          await this.sendKeysList(message, guild);
          return;
        }

        let updated = false;

        const moduleProperties = Configure.getModuleProperties(path);
        if (moduleProperties) {
          const { moduleName, relativePath } = moduleProperties;

          let update = await Guild.updateMany(
            { id: guild.id, 'modules.name': moduleName },
            {
              $set: {
                [`modules.$.${relativePath}`]: value
              }
            },
            { new: true }
          );

          // insert new row if doesn't exist
          if (update.nModified === 0) {
            update = await Guild.updateMany(
              { id: guild.id, 'modules.name': { $ne: moduleName } },
              {
                $push: {
                  modules: { name: moduleName, [relativePath]: value }
                }
              }
            );
          }

          updated = update.nModified === 1;
        } else {
          const oldValue = guild.get(path);
          const update = await guild.set(path, value).save();
          updated = update.get(path) !== oldValue;
        }

        if (updated) {
          await DiscordUtils.sendSuccess(message.channel, {
            title: path,
            fields: [
              {
                inline: true,
                name: 'Updated',
                value
              }
            ]
          });
        } else {
          await DiscordUtils.sendError(message.channel, {
            title: 'Failed to update',
            description: 'Check the path is correct'
          });
        }

        break;
      default:
        await DiscordUtils.sendError(
          message.channel,
          'The first argument must be either **get** or **set**'
        );
    }
  }

  private static getModuleProperties(
    path: string
  ): { moduleName: string; relativePath: string } | undefined {
    if (path.startsWith('modules.')) {
      const modules = ModuleRegistry.get().getModules();
      const moduleName = path.split('.')[1];

      if (modules.map(m => m.getIdentifier()).includes(moduleName)) {
        const relativePath = path.substr(`modules.${moduleName}.`.length);
        return { moduleName, relativePath };
      }
    }

    return undefined;
  }

  private async sendKeysList(message: Message, guild: IGuild & Document) {
    const keyPairs = Object.keys(guild.schema.paths).map(key => ({
      key,
      type: (guild.schema.paths[key] as any).instance
    }));

    const keys = keyPairs.filter(k => !k.key.startsWith('_') && k.key !== 'id');

    await DiscordUtils.sendEmbed(message.channel, {
      title: 'Keys',
      description: keys.map(k => `**${k.key}**: ${k.type}`).join('\n')
    });
  }

  /**
   * TODO: Fix
   * @param obj
   * @param depth
   */
  private objectDeepKeys(obj: any, depth = 0): string[] {
    return Object.keys(obj)
      .filter(key => obj[key] instanceof Object)
      .map(key =>
        depth < 5
          ? this.objectDeepKeys(obj[key], depth + 1)
          : [].map((k: string) => `${key}.${k}`)
      )
      .reduce((x, y) => x.concat(y), Object.keys(obj));
  }
}

export default Configure;

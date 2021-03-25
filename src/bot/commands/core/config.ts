import { ICommandMeta } from '../../../helper/commands/ICommand';
import { Message } from 'discord.js';
import ConfigManager from '../../../manager/ConfigManager';
import { DateTime } from 'luxon';

function parseValue(value: string) {
  if (value === 'true' || value === 'false') {
    return value === 'true';
  } else if (!isNaN(value as any) /* passing string to isNaN works fine */) {
    return parseFloat(value);
  } else {
    return value;
  }
}

async function config(
  message: Message,
  mode: string,
  key: string,
  value?: string
) {
  const guildId = message.guild.id;
  const configManager = ConfigManager.get();

  switch (mode) {
    case 'get': {
      if (!key) {
        return await message.channel.send({
          embed: { description: `:x: You must specify a key` },
        });
      }

      const item = await configManager.getById({ guildId, key });

      if (item) {
        await message.channel.send({
          embed: {
            title: key,
            description: item.value.toString(),
            fields: [
              {
                name: 'Updated',
                value: DateTime.fromJSDate(item.updatedAt).toFormat(
                  'dd MMM yyyy HH:mm'
                ),
              },
            ],
          },
        });
      } else {
        const keys = await configManager.getAll({
          guildId,
          key: { startsWith: key },
        });

        if (keys.length) {
          await message.channel.send({
            embed: {
              title: `Results: ${key}`,
              fields: keys.map((key) => ({
                name: key.key,
                value: key.value || '-',
              })),
            },
          });
        } else {
          await message.channel.send({
            embed: { description: `:x: No setting for key **${key}** exists.` },
          });
        }
      }

      break;
    }
    case 'set': {
      if (key.includes('.core.')) {
        return await message.channel.send({
          embed: {
            description: `:x: Core settings cannot be changed directly`,
          },
        });
      }

      const existingItem = await configManager.getById({ guildId, key });

      if (existingItem) {
        const item = await configManager.update(
          { guildId, key },
          { value: parseValue(value) }
        );

        await message.channel.send({
          embed: {
            title: key,
            description: item.value.toString(),
            fields: [
              {
                name: 'Updated',
                value: DateTime.fromJSDate(item.updatedAt).toFormat(
                  'dd MMM yyyy HH:mm'
                ),
              },
              {
                name: 'Note',
                value: 'Config updates may take a few seconds to apply',
              },
            ],
          },
        });
      } else {
        await message.channel.send({
          embed: { description: `:x: No setting for key **${key}** exists.` },
        });
      }

      break;
    }
    default: {
      await message.channel.send({
        embed: {
          description: `:x: Invalid mode. Please use either **get** or **set**.`,
        },
      });
    }
  }
}

export default config;

export const meta: ICommandMeta = {
  help: 'Reads or updates the current configuration',
  aliases: ['configure'],
  permission: 'ADMINISTRATOR',
};

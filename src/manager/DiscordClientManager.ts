import { Client } from '@prisma/client';
import { Client as DiscordClient, Guild } from 'discord.js';
import Collection from '@discordjs/collection';
import Logger from '../utils/logging/LoggerMixin';
import * as colors from '../utils/logging/colors';
import HooksHelper from '../helper/hooks/HooksHelper';
import ConfigManager from './ConfigManager';

class DiscordClientManager extends Logger {
  private static instance: DiscordClientManager;

  /**
   * A collection of client IDs
   * mapped to their Discord Clients.
   * @private
   */
  private clients: Collection<string, DiscordClient> = new Collection();

  private configManager: ConfigManager;
  private hooksHelper: HooksHelper;

  private constructor() {
    super();
    DiscordClientManager.instance = this;

    this.configManager = ConfigManager.get();
    this.hooksHelper = HooksHelper.get();
  }

  public static get() {
    return DiscordClientManager.instance ?? new DiscordClientManager();
  }

  public async login(client: Client, token: string): Promise<DiscordClient> {
    const discordClient = new DiscordClient({
      partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
      presence: {
        status: 'online',
        activity: { type: 'WATCHING', name: 'you' },
      },
    });

    await discordClient.login(token);

    HooksHelper.get()
      .getAll()
      .forEach((hook) => {
        discordClient.on(hook.event || 'message', async (...data) => {
          // TODO: Write a more robust solution for this
          const guild: Guild =
            data[0].guild ?? data[0].message.guild ?? data[0];

          const enabled = await this.configManager
            .getById({
              key: `${this.hooksHelper.getConfigKey(hook)}.enabled`,
              guildId: guild.id,
            })
            .then((c) => c.value);

          if (enabled) {
            hook.exec(...data);
          }
        });
      });

    this.clients.set(client.id, discordClient);

    this.log(`Logged in ${colors.client(client.name)}`);

    return discordClient;
  }

  public get(clientId: string): DiscordClient {
    return this.clients.get(clientId);
  }
}

export default DiscordClientManager;

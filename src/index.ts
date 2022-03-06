import SecretsHelper from './helper/SecretsHelper';
import ClientManager from './manager/ClientManager';
import DiscordClientManager from './manager/DiscordClientManager';
import GuildManager from './manager/GuildManager';
import ConfigManager from './manager/ConfigManager';
import CommandsHelper from './helper/commands/CommandsHelper';
import { log } from './utils/logging/logger';
import HooksHelper from './helper/hooks/HooksHelper';
import TimersHelper from './helper/timers/TimersHelper';
import * as APIServer from './api/Server';
import prisma from './client/prisma';

const secretsHelper = SecretsHelper.get();

const clientManager = ClientManager.get();
const discordClientManager = DiscordClientManager.get();
const guildManager = GuildManager.get();
const configManager = ConfigManager.get();

const commandsHelper = CommandsHelper.get();
const hooksHelper = HooksHelper.get();
const timersHelper = TimersHelper.get();

async function loadClients() {
  const clients = await clientManager.getAll();
  for (const client of clients) {
    const token = secretsHelper.decrypt(client.token);
    const discordClient = await discordClientManager.login(client, token);

    // pre-fetch some required data
    const partialGuilds = discordClient.guilds.cache;
    const guilds = await Promise.all(
      partialGuilds.map((guild) => guild.fetch())
    );

    await Promise.all(guilds.map((guild) => guild.members.fetch()));

    // ensure base configuration exists for each guild
    for (const guild of guilds) {
      const ensureConfig = async (key: string, value: any) =>
        await configManager.ensure({ guildId: guild.id, key }, value);

      await guildManager.ensure(guild.id, client.id);
      await ensureConfig('prefix', '$');
      await ensureConfig('logChannels', []);

      await Promise.all([
        commandsHelper.ensureConfig(guild.id),
        hooksHelper.ensureConfig(guild.id),
        timersHelper.ensureConfig(guild.id),
      ]);
    }
  }
}

async function init() {
  await Promise.all([
    commandsHelper.load(),
    hooksHelper.load(),
    timersHelper.load(),
  ]);

  await loadClients();

  await timersHelper.startTimers();

  await APIServer.init();

  log('Main', 'info', 'Load complete');
}

init().catch((e) => {
  log('Main', 'error', e.message);

  prisma.$disconnect();
  process.exit(1);
});

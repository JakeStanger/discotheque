import DiscordClient from './DiscordClient';
import { Logger } from '../utils/Logger';

class ClientManager extends Logger {
  private static readonly clients: DiscordClient[] = [];

  public static addClient(token: string) {
    const client = new DiscordClient(token);
    ClientManager.clients.push(client);
  }

  public static async loginClients() {
    ClientManager.log('Logging in clients');
    for (const client of ClientManager.clients) {
      await client.login();
      await client.startLoad();
    }
  }

  public static async alertLoaded() {
    for (const client of ClientManager.clients) {
      await client.finishLoad();
    }
  }

  /**
   * Gets the first client present in the guild
   * @param guildId
   */
  public static getClientForGuild(guildId: string) {
    return ClientManager.clients.find(c =>
      c.getDiscordClient().guilds.fetch(guildId)
    );
  }
}

export default ClientManager;

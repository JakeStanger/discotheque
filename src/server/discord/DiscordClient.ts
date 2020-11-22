import { Client } from 'discord.js';
import { Logger } from '../utils/Logger';
import MessageHandler from './MessageHandler';

class DiscordClient extends Logger {
  private readonly client: Client;
  private readonly _token: string;

  constructor(token: string) {
    super();

    const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

    const messageHandler = MessageHandler.get();

    client.on('message', messageHandler.onMessage);
    client.on('messageDelete', messageHandler.onMessageDelete);
    client.on('messageDeleteBulk', messages =>
      messages.forEach(messageHandler.onMessageDelete)
    );

    client.on('messageReactionAdd', messageHandler.onMessageReact);

    this.client = client;
    this._token = token;
  }

  public login() {
    return this.client.login(this._token);
  }

  public async startLoad() {
    await this.client.user!.setStatus('dnd');
    await this.client.user!.setActivity('Loading');
  }

  public async finishLoad() {
    await this.client.user!.setStatus('online');
    await this.client.user!.setActivity('you', { type: 'WATCHING' });
  }

  public getDiscordClient() {
    return this.client;
  }
}

export default DiscordClient;

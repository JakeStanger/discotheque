import { Logger } from '../utils/Logger';
import { defaultGuildSettings } from './DefaultSettings';
import IGuild from './schema/IGuild';
import { Collection, FindAndModifyWriteOpResultObject } from 'mongodb';
import Database from './Database';

class GuildManager extends Logger {
  private static instance: GuildManager;
  private collection: Collection<IGuild>;

  constructor() {
    super();
    GuildManager.instance = this;
    this.collection = Database.get().db.collection<IGuild>('guilds');
  }

  public static get() {
    return GuildManager.instance || new GuildManager();
  }
  public async getGuild(id: string) /*: Promise<IGuild>*/ {
    return this.collection.find({ id });
  }

  public async getGuilds(guilds: string[]) {
    return this.collection.find({ $or: guilds.map(guild => ({ id: guild })) });
  }

  /**
   * Adds a guild if it does not already exist
   * @param id
   */
  public async addGuild(id: string): Promise<IGuild | undefined> {
    return this.collection
      .findOneAndUpdate(
        { id },
        { $setOnInsert: { ...defaultGuildSettings, id } },
        { returnOriginal: true, upsert: true }
      )
      .then(res => res.value);
  }
}

export default GuildManager;

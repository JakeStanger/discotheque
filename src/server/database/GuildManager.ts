import { Logger } from '../utils/Logger';
import { defaultGuildSettings } from './DefaultSettings';
import IGuild, { Guild } from './schema/IGuild';

class GuildManager extends Logger {
  private static instance: GuildManager;

  constructor() {
    super();
    GuildManager.instance = this;
  }

  public static get() {
    return GuildManager.instance || new GuildManager();
  }
  public async getGuild(id: string) /*: Promise<IGuild>*/ {
    return Guild.findOne({ id });
  }

  public async getGuilds(guilds: string[]) {
    return Guild.find({ $or: guilds.map(guild => ({ id: guild })) });
  }

  /**
   * Adds a guild if it does not already exist
   * @param id
   */
  public async addGuild(id: string): Promise<IGuild | null> {
    return Guild.findOneAndUpdate(
      { id },
      { $setOnInsert: { ...defaultGuildSettings, id } },
      { new: true, upsert: true }
    );
  }

  public async updateGuild(id: string, update: Partial<IGuild>) {
    return Guild.findOneAndUpdate({ id }, { $set: update }, { new: true });
  }
}

export default GuildManager;

import IModuleConfiguration, {
  moduleConfigurationSchema
} from './IModuleConfiguration';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Snowflake } from 'discord.js';

interface IGuild {
  id: Snowflake;
  logMessages: Snowflake[];
  prefix: string;
  modules: IModuleConfiguration[];
}

const guildSchema = new mongoose.Schema<IGuild>({
  id: { type: String, unique: true },
  logMessages: [String],
  prefix: String,
  modules: [moduleConfigurationSchema]
});

export const Guild = mongoose.model<IGuild & Document>('Guild', guildSchema);
export default IGuild;

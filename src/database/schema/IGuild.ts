import IModuleConfiguration, {
  moduleConfigurationSchema,
  // ModuleConfiguration
} from './IModuleConfiguration';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

interface IGuild {
  id: string;
  logMessages: boolean;
  prefix: string;
  modules: IModuleConfiguration[];
}

const guildSchema = new mongoose.Schema<IGuild>({
  id: { type: String, unique: true },
  logMessages: Boolean,
  prefix: String,
  modules: [moduleConfigurationSchema]
});

export const Guild = mongoose.model<IGuild & Document>('Guild', guildSchema);
export default IGuild;

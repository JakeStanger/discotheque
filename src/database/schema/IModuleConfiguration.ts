import { Schema } from 'mongoose';

interface IModuleConfiguration {
  name: string;
  disabled?: boolean;
  settings?: Map<string, string>;
}

export const moduleConfigurationSchema = new Schema({
  name: { type: String, unique: true },
  disabled: { type: Boolean },
  settings: { type: Map, of: String }
});

export default IModuleConfiguration;

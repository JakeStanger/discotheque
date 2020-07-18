import { Schema } from 'mongoose';
const { Mixed } = Schema.Types;

interface IModuleConfiguration {
  name: string;
  disabled?: boolean;
  settings?: Map<string, any>;
}

export const moduleConfigurationSchema = new Schema({
  name: { type: String },
  disabled: { type: Boolean },
  settings: { type: Map, of: Mixed }
});

export default IModuleConfiguration;

import { GuildMember } from 'discord.js';
import IItem from './database/schema/IItem';

interface IDistrictMember {
  member: GuildMember;
  district: number;

  health: number;
  hunger: number;
  stamina: number;
  strength: number;

  weapon?: IItem;
  armour?: IItem;
  food: IItem[];
}

export default IDistrictMember;

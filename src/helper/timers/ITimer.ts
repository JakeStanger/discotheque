import IAction, { IActionMetadata } from '../IAction';
import { Guild } from 'discord.js';

export interface ITimerMetadata extends IActionMetadata {
  pattern: string;
}

interface ITimer extends IAction, ITimerMetadata {
  exec: (guild: Guild) => void;
}

export default ITimer;

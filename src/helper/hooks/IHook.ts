import { ClientEvents } from 'discord.js';
import IAction, { IActionMetadata } from '../IAction';

export interface IHookMetadata extends IActionMetadata {
  event: keyof ClientEvents;
}

interface IHook<K extends keyof ClientEvents> extends IAction, IHookMetadata {
  exec: (...args: ClientEvents[K]) => void;
}

export default IHook;

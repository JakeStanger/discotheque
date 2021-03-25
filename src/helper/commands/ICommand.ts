import { Message, PermissionString } from 'discord.js';
import IAction, { IActionMetadata } from '../IAction';

export interface ICommandMeta extends IActionMetadata {
  aliases?: string[];
  permission?: PermissionString;
}

interface ICommand extends ICommandMeta, IAction {
  isAlias: boolean;
  exec: (message: Message, ...args: string[]) => Promise<any>;
}

export default ICommand;

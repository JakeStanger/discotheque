import { Prisma } from '@prisma/client';

export interface IActionMetadata {
  ensureConfig?: Record<string, Prisma.JsonValue>;
  help: string;
}

interface IAction extends IActionMetadata {
  name: string;
  module: string;
  exec: (...args: any[]) => any;
}

export default IAction;

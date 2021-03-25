import { debug, error, info, warn } from './logger';

abstract class Logger {
  protected log(...message: any[]) {
    this.info(...message);
  }

  protected debug(...message: any[]) {
    debug(this, ...message);
  }

  protected info(...message: any[]) {
    info(this, ...message);
  }

  protected warn(...message: any[]) {
    warn(this, ...message);
  }

  protected error(...message: any[]) {
    error(this, ...message);
  }
}

export default Logger;

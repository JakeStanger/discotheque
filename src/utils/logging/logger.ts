import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const loggerFormat = format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  transports: [
    new transports.DailyRotateFile({
      format: format.combine(
        format.uncolorize(),
        format.timestamp(),
        loggerFormat
      ),
      filename: 'logs/error-%DATE%.log',
      level: 'error',
    }),
    new transports.DailyRotateFile({
      filename: 'logs/combined-%DATE%-.log',
      format: format.combine(
        format.uncolorize(),
        format.timestamp(),
        loggerFormat
      ),
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        loggerFormat
      ),
    })
  );
}

export function log(
  label: string | InstanceType<any> | { new (): any },
  level: LogLevel,
  ...message: any[]
) {
  if (typeof label !== 'string') {
    label = label.name ?? label.constructor.name;
  }

  const messageJoined = message
    .map((m) => (typeof m === 'object' ? JSON.stringify(m) : m?.toString()))
    .join(' ');

  logger.log({
    level: level ?? 'info',
    label,
    message: messageJoined,
  });
}

export function debug(label: string | InstanceType<any>, ...message: any[]) {
  log(label, 'debug', ...message);
}

export function info(label: string | InstanceType<any>, ...message: any[]) {
  log(label, 'info', ...message);
}

export function warn(label: string | InstanceType<any>, ...message: any[]) {
  log(label, 'warn', ...message);
}

export function error(label: string | InstanceType<any>, ...message: any[]) {
  log(label, 'error', ...message);
}

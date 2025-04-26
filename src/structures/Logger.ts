import { LoggerOptions } from "../interfaces/ILogger";

export default class Logger {
  static readonly LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4,
  };

  private appName: string;
  private minLevel: number;
  private showTimestamp: boolean;
  private showLogLevel: boolean;
  private colors: boolean;

  constructor(options: LoggerOptions = {}) {
    this.appName = options.appName || "App";
    this.minLevel =
      options.minLevel !== undefined
        ? options.minLevel
        : Logger.LOG_LEVELS.DEBUG;
    this.showTimestamp =
      options.showTimestamp !== undefined ? options.showTimestamp : true;
    this.showLogLevel =
      options.showLogLevel !== undefined ? options.showLogLevel : true;
    this.colors = options.colors !== undefined ? options.colors : true;
  }

  formatMessage(level: number, message: string): string {
    const timestamp = this.showTimestamp
      ? `[${new Date().toLocaleString()}]`
      : "";
    const appName = `[${this.appName}]`;
    const reset = this.resetColor();

    const levelName = this.showLogLevel
      ? `[${Object.keys(Logger.LOG_LEVELS).find(
          (key) =>
            Logger.LOG_LEVELS[key as keyof typeof Logger.LOG_LEVELS] === level
        )}]`
      : "";
    return `${timestamp} ${appName} ${levelName}${reset} ${message}`;
  }

  getColor(level: number): string {
    if (!this.colors) return "";
    switch (level) {
      case Logger.LOG_LEVELS.DEBUG:
        return "\x1b[36m";
      case Logger.LOG_LEVELS.INFO:
        return "\x1b[32m";
      case Logger.LOG_LEVELS.WARN:
        return "\x1b[33m";
      case Logger.LOG_LEVELS.ERROR:
        return "\x1b[31m";
      default:
        return "\x1b[0m";
    }
  }

  resetColor(): string {
    return this.colors ? "\x1b[0m" : "";
  }

  log(level: number, message: string, ...optionalParams: any[]): void {
    if (level < this.minLevel) return;
    const formattedMessage = this.formatMessage(level, message);
    const color = this.getColor(level);
    const reset = this.resetColor();
    switch (level) {
      case Logger.LOG_LEVELS.DEBUG:
        console.debug(`${color}${formattedMessage}${reset}`, ...optionalParams);
        break;
      case Logger.LOG_LEVELS.INFO:
        console.info(`${color}${formattedMessage}${reset}`, ...optionalParams);
        break;
      case Logger.LOG_LEVELS.WARN:
        console.warn(`${color}${formattedMessage}${reset}`, ...optionalParams);
        break;
      case Logger.LOG_LEVELS.ERROR:
        console.error(`${color}${formattedMessage}${reset}`, ...optionalParams);
        break;
    }
  }

  debug(message: string, ...optionalParams: any[]): void {
    this.log(Logger.LOG_LEVELS.DEBUG, message, ...optionalParams);
  }

  info(message: string, ...optionalParams: any[]): void {
    this.log(Logger.LOG_LEVELS.INFO, message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]): void {
    this.log(Logger.LOG_LEVELS.WARN, message, ...optionalParams);
  }

  error(message: string, ...optionalParams: any[]): void {
    this.log(Logger.LOG_LEVELS.ERROR, message, ...optionalParams);
  }

  setLevel(level: number): boolean {
    if (Object.values(Logger.LOG_LEVELS).includes(level)) {
      this.minLevel = level;
      return true;
    }
    return false;
  }

  showTimestamps(show: boolean = true): void {
    this.showTimestamp = show;
  }

  useColors(use: boolean = true): void {
    this.colors = use;
  }
}
